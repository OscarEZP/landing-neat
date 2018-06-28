import {Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import {HistoricalReportService} from '../_services/historical-report.service';
import * as moment from 'moment';
import {Style} from '../../../../shared/_models/style';
import {ApiRestService} from '../../../../shared/_services/apiRest.service';
import {RelationedTaskSearch} from '../../../../shared/_models/task/search/relationedTaskSearch';
import {Task} from '../../../../shared/_models/task/task';
import {DateRange} from '../../../../shared/_models/common/dateRange';
import {TimeInstant} from '../../../../shared/_models/timeInstant';
import {TimelineTask} from '../../../../shared/_models/task/timelineTask';
import {DataSet, Timeline} from 'vis';
import {Review} from '../../../../shared/_models/task/analysis/review';
import {TimelineOptions} from '../../../../shared/_models/task/timelineOptions';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'lsl-timeline-report',
    templateUrl: './timeline-report.component.html',
    styleUrls: ['./timeline-report.component.scss']
})
export class TimelineReportComponent implements OnInit, OnDestroy {

    private static DAYS_FROM = 30;
    private static ZOOM_MIN_DAYS = 15;
    private static ZOOM_MAX_MONTH = 3;
    private static ACTIVE_TASK_DAYS = 4;

    private static TASK_SEARCH_ENDPOINT = 'taskRelationsSearch';
    private static TASK_HISTORICAL_ENDPOINT = 'taskHistorical';
    private static TIMELINE_DATE_FORMAT = 'YYYY-MM-DD';

    @Output()
    onAnalyzedTaskSelected: EventEmitter<TimelineTask> = new EventEmitter();

    @Output()
    onAtaCorrected: EventEmitter<any> = new EventEmitter();

    @Output()
    onEditorLoad: EventEmitter<boolean> = new EventEmitter();

    private _tooltip: boolean;
    private _tooltipStyle: Style;
    private _timeline: Timeline;
    private _taskList: Task[];
    private _loading: boolean;
    private _error: boolean;
    private _minDate: moment.Moment;
    private _clickEvent: object;
    private _listSubscription: Subscription;
    private _taskHistoricalSubscription: Subscription;
    private _dataSet: DataSet<object>;
    private _updatedByUser: boolean;
    private _timelineTaskSelected: object;
    private _firstLoad: boolean;

    private _tasksFromReport: TimelineTask[];
    private _tasksReplacedByReport: TimelineTask[];

    private _tasksFromReportSubs: Subscription;

    constructor(
        private _translate: TranslateService,
        private _element: ElementRef,
        private _historicalReportService: HistoricalReportService,
        private _apiRestService: ApiRestService
    ) {
        this._translate.setDefaultLang('en');
    }

    ngOnInit() {
        this.tooltip = false;
        this.tooltipStyle = new Style();
        this.taskList = [];
        this.listSubscription = null;
        this.taskHistoricalSubscription = null;
        this.tasksFromReportSubs = null;
        this.updatedByUser = false;
        this.historicalReportRelated = null;
        this.tasksFromReport = [];
        this.tasksReplacedByReport = [];
        this.timelineData = this.getTimelineInitData();
        this.clickEvent = null;
        this.createTimeline(this.timelineData);
        this.firstLoad = false;
        if (this.activeTask.timelineStatus === Task.CLOSE_STATUS) {
            this.taskHistoricalSubscription = this.getTaskHistoricalSubscription(this.activeTask);
        }
    }

    ngOnDestroy() {
        if (this.tasksFromReportSubs) {
            this.tasksFromReportSubs.unsubscribe();
        }
        if (this.listSubscription) {
            this.listSubscription.unsubscribe();
        }
        if (this.taskHistoricalSubscription) {
            this.taskHistoricalSubscription.unsubscribe();
        }
        this.timeline.destroy();
    }

    /**
     * Get options for Timeline creation by a Moment object
     * @returns {TimelineOptions}
     */
    private getTimelineOptions(): TimelineOptions {
        const maxDate = moment(this.activeTask.createEpochTime)
            .utc()
            .add(TimelineReportComponent.ACTIVE_TASK_DAYS, 'days')
            .format(TimelineReportComponent.TIMELINE_DATE_FORMAT);
        return new TimelineOptions(
            this.minDate.format(TimelineReportComponent.TIMELINE_DATE_FORMAT),
            maxDate,
            TimelineReportComponent.ZOOM_MIN_DAYS,
            TimelineReportComponent.ZOOM_MAX_MONTH * 30,
            true
        );
    }

    /**
     * Return a Timeline object by a TimelineTask list; if there is a Timeline object, this method update it, else is created
     * @param {TimelineTask[]} data
     * @returns {Timeline}
     */
    private createTimeline(data: TimelineTask[]) {
        data = data.map(task => task.getJson());
        const dataMinDate = this.timelineData
            .sort((a, b) => a.createDate.epochTime > b.createDate.epochTime ? 1 : -1).find(tl => !!tl);
        this.minDate = moment(dataMinDate ? dataMinDate.createDate.epochTime : this.activeTask.createEpochTime).utc();

        if (this.timeline) {
            this.tooltip = false;
            this.timeline.setOptions(this.getTimelineOptions().getJson());
            this.dataSet.update(data);
        } else {
            this.dataSet = new DataSet(data);
            this.timeline = this.getNewTimeline(this.dataSet);
        }
    }

    /**
     * Return a new Timeline by a DataSet
     * @param {DataSet<object>} items
     * @returns {Timeline}
     */
    private getNewTimeline(items: DataSet<object>): Timeline {

        const options = this.getTimelineOptions().getJson();
        const timeline = new Timeline(this.element.nativeElement, items, options);

        timeline.on('click', (event: object) => {
            this.clickEvent = event;
            if (event['what'] === 'item') {
                this.showTooltip();
                this.onAnalyzedTaskSelected.emit(this.timelineTaskSelected['data']);
                this.onEditorLoad.emit(false);
            } else {
                this.tooltip = false;
            }
        });
        timeline.on('rangechange', () => {
            this.updatedByUser = true;
            this.tooltip = false;
        });
        timeline.on('changed', () => {
            if (this.updatedByUser || this.firstLoad) {
                this.timelineData.map(tl => {
                    tl.width = this.getTimelineItems().find(ti => ti.data.task.barcode === tl.barcode).width;
                    return tl;
                });
                this.dataSet.update(this.timelineData.map(tl => tl.getJson()));
                this.updatedByUser = false;
                this.firstLoad = false;
            }
        });
        timeline.on('select', (sel) => {
            this.timelineTaskSelected = this.timeline['itemSet']['items'][sel.items[0]];
        });
        return timeline;
    }

    /**
     * Get items from timeline graph object
     * @returns {any[]}
     */
    private getTimelineItems() {
        const tlItems = this.timeline['itemSet']['items'];
        return Object
            .keys(tlItems)
            .map(i => tlItems[i]);
    }

    /**
     * Observable for get historical reports
     * @param {string} param
     * @returns {Observable<Task[]>}
     */
    private tasksFromReport$(param: string): Observable<Task[]> {
        return this._apiRestService
            .getSingle<Task[]>(TimelineReportComponent.TASK_HISTORICAL_ENDPOINT, param);
    }

    /**
     * Returns initial timeline data
     * @returns {TimelineTask[]}
     */
    private getTimelineInitData(): TimelineTask[] {
        return [new TimelineTask(this.activeTask, true)];
    }

    /**
     * Subscription for get a data list
     * @param signature
     * @return {Subscription}
     */
    private getListSubscription(signature: RelationedTaskSearch): Subscription {
        this.loading = true;
        return this._apiRestService.search<Task[]>(TimelineReportComponent.TASK_SEARCH_ENDPOINT, signature)
            .subscribe(
                (list) => {
                    this.taskList = list;
                    this.loading = false;
                    this.setRelatedTasks();
                    this.onAtaCorrected.emit(true);
                    this.createTimeline(this.timelineData);
                },
                () => this.getError()
            );
    }

    /**
     * Get Task Analysis Historical
     * @param {string} barcode
     * @returns {Subscription}
     */
    private getTaskHistoricalSubscription(task: Task): Subscription {
        this.loading = true;
        return this._apiRestService
            .getSingle<Task[]>(TimelineReportComponent.TASK_HISTORICAL_ENDPOINT, task.barcode)
            .subscribe(
                (list) => {
                    this.taskList = list;
                    this.loading = false;
                    this.setRelatedTasks();
                    this.onAnalyzedTaskSelected.emit(new TimelineTask(task, true, true));
                    this.onEditorLoad.emit(true);
                    this.firstLoad = true;
                    const reportRelated = this.timelineData
                        .find(tl => tl.reviews.length > 0);
                    this.historicalReportRelated = reportRelated ? reportRelated : this.historicalReportRelated;
                    this.timelineData
                        .filter(tl => tl.hasHistorical && this.historicalReportRelated && tl.barcode !== this.historicalReportRelated.barcode)
                        .map(tl => {
                            tl.isHistoricalEnabled = false;
                            return tl;
                        });
                    if (this.historicalReportRelated) {
                        this.tasksFromReportSubs = this.getHistoricalReportTasksSubs();
                    } else {
                        this.createTimeline(this.timelineData);
                    }
                },
                () => this.getError()
            );
    }

    /**
     * Subscription for handle historical reports
     * @returns {Subscription}
     */
    private getHistoricalReportTasksSubs(): Subscription {
        return this.tasksFromReport$(this.historicalReportRelated.barcode)
            .subscribe(tasks => {
                const filteredTasks = tasks.filter(t => !!this.historicalReportRelated.reviews.find(r => r.barcode === t.barcode));
                this.handleAddedTasks(filteredTasks.map(ft => {
                    const review = this.historicalReportRelated.reviews.find(r => r.barcode === ft.barcode);
                    ft.review = review;
                    return ft;
                }));
                this.createTimeline(this.timelineData);
            });
    }

    /**
     * Process after update ATA
     * @param {boolean} result
     */
    public checkCorrectedATA(result: boolean) {
        if (result) {
            this.updatedByUser = true;
            const signature: RelationedTaskSearch = RelationedTaskSearch.getInstance();
            signature.tail = this.activeTask.tail;
            signature.ataGroup = this.activeTask.ata;
            signature.barcode = this.activeTask.barcode;
            const endDate = this.activeTask.createEpochTime;
            const initDate = moment(endDate).utc().subtract(TimelineReportComponent.DAYS_FROM, 'days').valueOf();
            signature.dateRange = new DateRange(new TimeInstant(initDate, ''), new TimeInstant(endDate, ''));
            this.listSubscription = this.getListSubscription(signature);
        }
    }

    /**
     * Set the first level of related tasks
     */
    private setRelatedTasks() {
        this.timelineData = this.taskList.map(task =>
            new TimelineTask(task, task.id === this.activeTask.id, true, task.review ? task.review.apply : null)
        );
        const findTask = this.timelineData.find(value => value.barcode === this.activeTask.barcode);
        if (typeof findTask === 'undefined') {
            this.timelineData.push(new TimelineTask(this.activeTask, true, true));
        }
    }

    /**
     * Get style for tooltip
     * @returns {Style}
     */
    public getTooltipStyle(): Style {
        const item = this.timelineTaskSelected;
        if (item) {
            this.tooltipStyle.top = this.clickEvent['y'] + 'px';
            this.tooltipStyle.left = this.clickEvent['x'] + 'px';
        }
        return this.tooltipStyle;
    }

    /**
     * Show tooltip if there is a TimelineTask selected and isn't the active task (first task)
     */
    public showTooltip(): void {
        const timelineSelected = this.timelineTaskSelected;
        this.tooltip = !!(timelineSelected && !timelineSelected['data']['active']);
        if (this.tooltip) {
            this.getTooltipStyle();
        }
    }

    /**
     * Refresh the timeline after apply a task
     * @param {Review} review
     */
    public refreshOnApply(review: Review): void {
        const itemUpdated = this.timelineData
            .find(item => item.task.barcode === review.barcode);
        itemUpdated.apply = review.apply;
        itemUpdated.className = itemUpdated.generateClassName();
        this.timelineData.map(v => v.barcode === itemUpdated.barcode ? itemUpdated : v);
        this.dataSet.update([itemUpdated.getJson()]);

        if (itemUpdated.hasHistorical && (!this.historicalReportRelated || this.historicalReportRelated === itemUpdated)) {
            this.historicalReportRelated = itemUpdated.apply ? itemUpdated : null;
            this.updatedByUser = true;
            this.dataSet.update(this.getReportsNotSelected(itemUpdated, !itemUpdated.apply));
            this.handleTasksFromReport(itemUpdated);
        }

        this.tooltip = false;
    }

    /**
     * Add a new TimelineTask to timeline
     * @param {TimelineTask[]} timelineTasks
     */
    private addTimelineTask(timelineTasks: TimelineTask[]) {
        this.updatedByUser = true;
        this.dataSet.add(timelineTasks.map(tl => tl.getJson()));
    }

    /**
     * Delete a current TimelineTask from timeline
     * @param {TimelineTask[]} timelineTasks
     */
    private delTimelineTask(timelineTasks: TimelineTask[]) {
        this.updatedByUser = true;
        this.dataSet.remove(timelineTasks.map(tl => tl.getJson()));
    }

    /**
     * Set new TimelineTaks from historical reports
     * @param {Task[]} tasks
     */
    private handleAddedTasks(tasks: Task[]) {
        this.tasksFromReport = tasks.map(t => {
            const tlt = new TimelineTask(t, false, true, t.review.apply);
            tlt.isHistoricalChildren = true;
            return tlt;
        });
        this.tasksReplacedByReport = this.timelineData
            .filter(td => this.tasksFromReport.find(tfr => tfr.barcode === td.barcode));
        this.delTimelineTask(this.tasksReplacedByReport);
        this.timelineData = this.timelineData
            .filter(tl => !this.tasksReplacedByReport.find(trr => trr.barcode === tl.barcode))
            .concat(this.tasksFromReport);
        this.addTimelineTask(this.tasksFromReport);
        this.createTimeline(this.timelineData);
    }

    /**
     * Remove TimelineTasks from historical reports
     */
    private handleDeletedTasks() {
        this.delTimelineTask(this.tasksFromReport);
        this.timelineData = this.timelineData
            .filter(tl => !this.tasksFromReport.find(tfr => tl.barcode === tfr.barcode))
            .concat(this.tasksReplacedByReport);
        this.addTimelineTask(this.tasksReplacedByReport);
        this.createTimeline(this.timelineData);
    }

    /**
     * Add or remove tasks by 'Apply'
     * @param {TimelineTask} itemUpdated
     */
    private handleTasksFromReport(itemUpdated: TimelineTask) {
        if (itemUpdated.apply) {
            this.tasksFromReportSubs = this.tasksFromReport$(itemUpdated.barcode)
                .subscribe(tasks => this.handleAddedTasks(tasks));
        } else {
            this.handleDeletedTasks();
        }
    }

   /* /!**
     * Validation for get just one historical report
     * @param {TimelineTask} tlTask
     * @returns {TimelineTask}
     *!/
    private validateHistoricalReport(tlTask: TimelineTask): boolean {
        if (tlTask.hasHistorical && tlTask.apply === true && !this.historicalReportRelated) {
            // this.updatedByUser = true;
            // this.dataSet.update(this.getReportsNotSelected(tlTask, false));
            return true;
        } else if (tlTask.hasHistorical && tlTask.apply === false && tlTask === this.historicalReportRelated) {
            // this.updatedByUser = true;
            // this.dataSet.update(this.getReportsNotSelected(tlTask, true));
            return false;
        }
        return false;
        // return this.historicalReportRelated;
    }*/

    /**
     * Get unselected reports
     * @param {TimelineTask} tlTask
     * @param {boolean} enabled
     * @returns {object[]}
     */
    private getReportsNotSelected(tlTask: TimelineTask, enabled: boolean): object[] {
        return this.timelineData
            .filter(i => i.task.hasHistorical && i.barcode !== tlTask.barcode)
            .map(i => {
                i.isHistoricalEnabled = enabled;
                return i.getJson();
            });
    }

    /**
     * Returns Timeline Task selected
     * @returns {object | null}
     */
    get timelineTaskSelected(): object {
        return this._timelineTaskSelected;
    }

    set timelineTaskSelected(value: object) {
        this._timelineTaskSelected = value;
    }

    /**
     * Handler for error process on api request
     * @return {boolean}
     */
    private getError(): boolean {
        this.loading = false;
        return this.error = true;
    }

    get tooltip(): boolean {
        return this._tooltip;
    }

    set tooltip(value: boolean) {
        this._tooltip = value;
    }

    get tooltipStyle(): Style {
        return this._tooltipStyle;
    }

    set tooltipStyle(value: Style) {
        this._tooltipStyle = value;
    }

    get taskList(): Task[] {
        return this._taskList;
    }

    set taskList(value: Task[]) {
        this._taskList = value;
    }

    get error(): boolean {
        return this._error;
    }

    set error(value: boolean) {
        this._error = value;
    }

    get timelineData(): TimelineTask[] {
        return this._historicalReportService.timelineData;
    }

    set timelineData(value: TimelineTask[]) {
        this._historicalReportService.timelineData = value;
    }

    get timeline(): Timeline {
        return this._timeline;
    }

    set timeline(value: Timeline) {
        this._timeline = value;
    }

    get loading(): boolean {
        return this._loading;
    }

    set loading(value: boolean) {
        this._loading = value;
    }

    get minDate(): moment.Moment {
        return this._minDate;
    }

    set minDate(value: moment.Moment) {
        this._minDate = value;
    }

    get activeTask(): Task {
        return this._historicalReportService.task;
    }

    get element(): ElementRef {
        return this._element;
    }

    get clickEvent(): object {
        return this._clickEvent;
    }

    set clickEvent(value: object) {
        this._clickEvent = value;
    }

    get listSubscription(): Subscription {
        return this._listSubscription;
    }

    set listSubscription(value: Subscription) {
        this._listSubscription = value;
    }

    get dataSet(): DataSet<object> {
        return this._dataSet;
    }

    set dataSet(value: DataSet<object>) {
        this._dataSet = value;
    }

    get updatedByUser(): boolean {
        return this._updatedByUser;
    }

    set updatedByUser(value: boolean) {
        this._updatedByUser = value;
    }

    get historicalReportRelated(): TimelineTask {
        return this._historicalReportService.historicalReportRelated;
    }

    set historicalReportRelated(value: TimelineTask) {
        this._historicalReportService.historicalReportRelated = value;
    }

    get tasksFromReport(): TimelineTask[] {
        return this._tasksFromReport;
    }

    set tasksFromReport(value: TimelineTask[]) {
        this._tasksFromReport = value;
    }

    get tasksReplacedByReport(): TimelineTask[] {
        return this._tasksReplacedByReport;
    }

    set tasksReplacedByReport(value: TimelineTask[]) {
        this._tasksReplacedByReport = value;
    }

    get tasksFromReportSubs(): Subscription {
        return this._tasksFromReportSubs;
    }

    set tasksFromReportSubs(value: Subscription) {
        this._tasksFromReportSubs = value;
    }

    get taskHistoricalSubscription(): Subscription {
        return this._taskHistoricalSubscription;
    }

    set taskHistoricalSubscription(value: Subscription) {
        this._taskHistoricalSubscription = value;
    }

    get firstLoad(): boolean {
        return this._firstLoad;
    }

    set firstLoad(value: boolean) {
        this._firstLoad = value;
    }
}
