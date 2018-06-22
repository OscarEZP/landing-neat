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
// import {Analysis} from '../../../../shared/_models/task/analysis/analysis';
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

    private static TASK_SEARCH_ENDPOINT = 'taskRelationsSearch';
    private static TASK_HISTORICAL_ENDPOINT = 'taskHistorical';
    private static REPORT_CLOSE = 'CLOSE';
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
    // private _analysis: Analysis;
    private _clickEvent: object;
    private _listSubscription: Subscription;
    private _taskHistoricalSubscription: Subscription;
    private _dataSet: DataSet<object>;
    private _updatedByUser: boolean;
    private _timelineTaskSelected: object;
    private _historicalReportRelated: TimelineTask;
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
        // this.analysis = Analysis.getInstance();
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
        if (this.activeTask.timelineStatus === TimelineReportComponent.REPORT_CLOSE) {
            this.taskHistoricalSubscription = this.getTaskHistoricalSubscription(this.activeTask.barcode);
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
     * @param {moment.Moment} maxTime
     * @returns {TimelineOptions}
     */
    private getTimelineOptions(maxTime: moment.Moment): TimelineOptions {
        return new TimelineOptions(
            this.minDate.format(TimelineReportComponent.TIMELINE_DATE_FORMAT),
            this.minDate.add(TimelineReportComponent.DAYS_FROM + 2, 'days').format(TimelineReportComponent.TIMELINE_DATE_FORMAT),
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
        const dataMinDate = this.taskList
            .sort((a, b) => a.createEpochTime < b.createEpochTime ? 1 : -1).find(tl => !!tl);
        this.minDate = moment(dataMinDate ? dataMinDate.createEpochTime : this.activeTask.createEpochTime)
            .utc()
            .subtract(TimelineReportComponent.DAYS_FROM, 'days');
        if (this.timeline) {
            this.tooltip = false;
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

        const maxTime = moment(this.activeTask.dueDateEpochTime).utc();
        const options = this.getTimelineOptions(maxTime).getJson();
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
                console.log('change');
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

    private getTimelineItems() {
        const tlItems = this.timeline['itemSet']['items'];
        return Object
            .keys(tlItems)
            .map(i => tlItems[i]);
    }

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
                },
                () => this.getError()
            );
    }

    /**
     * Get Task Analysis Historical
     * @param {string} barcode
     * @returns {Subscription}
     */
    private getTaskHistoricalSubscription(barcode: string): Subscription {
        this.loading = true;
        return this._apiRestService
            .getSingle<Task[]>(TimelineReportComponent.TASK_HISTORICAL_ENDPOINT, barcode)
            .subscribe(
                (list) => {
                    this.taskList = list;
                    this.loading = false;
                    this.setRelatedTasks();
                    this.onAnalyzedTaskSelected.emit(new TimelineTask(this.activeTask, true, true));
                    this.onEditorLoad.emit(true);
                    this.firstLoad = true;
                },
                () => this.getError()
            );
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

    private setRelatedTasks() {
        this.timelineData = this.taskList.map(task =>
            new TimelineTask(task, task.id === this.activeTask.id, true, task.review ? task.review.apply : null)
        );
        const findTask = this.timelineData.find(value => value.barcode === this.activeTask.barcode);
        if (typeof findTask === 'undefined') {
            this.timelineData.push(new TimelineTask(this.activeTask, true, true));
        }
        this.createTimeline(this.timelineData);
        // this.updateReview();
    }

   /* /!**
     * Validation when a review is not null
     * @param {Review} review
     * @returns {boolean}
     *!/
    private validateApply(review: Review): boolean {
        let apply: boolean = null;
        if (review !== null) {
            if (review.apply) {
                this.updateReview();
            }
            apply = review.apply;
        }
        return apply;
    }*/

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
        // this.updateReview();
        this.tooltip = false;
        this.historicalReportRelated = this.validateHistoricalReport(itemUpdated);
        if (this.historicalReportRelated === itemUpdated || !this.historicalReportRelated) {
            this.handleTasksFromReport(itemUpdated);
        }
    }

    private addTimelineTask(timelineTasks: TimelineTask[]) {
        this.updatedByUser = true;
        this.dataSet.add(timelineTasks.map(tl => {
            // this.updateReview();
            return tl.getJson();
        }));
    }

    private delTimelineTask(timelineTasks: TimelineTask[]) {
        this.updatedByUser = true;
        this.dataSet.remove(timelineTasks.map(tl => {
            // this.reviews = this.reviews.filter(r => r.barcode !== tl.barcode);
            // this.updateReview();
            return tl.getJson();
        }));
    }

    private getTasksFromReportSubs(barcode: string): Subscription {
        return this.tasksFromReport$(barcode)
            .subscribe(tasks => {
                this.tasksFromReport = tasks.map(t => new TimelineTask(t, false, true));
                this.tasksReplacedByReport = this.timelineData
                    .filter(td => this.tasksFromReport.find(tfr => tfr.barcode === td.barcode));
                this.delTimelineTask(this.tasksReplacedByReport);
                this.timelineData = this.timelineData
                    .filter(tl => !this.tasksReplacedByReport.find(trr => trr.barcode === tl.barcode))
                    .concat(this.tasksFromReport);
                this.addTimelineTask(this.tasksFromReport);
                this.dataSet.update(this.timelineData);
            });
    }

    private handleTasksFromReport(itemUpdated: TimelineTask) {
        if (itemUpdated.apply) {
            this.tasksFromReportSubs = this.getTasksFromReportSubs(itemUpdated.barcode);
        } else {
            this.delTimelineTask(this.tasksFromReport);
            this.timelineData = this.timelineData
                .filter(tl => !this.tasksFromReport.find(tfr => tl.barcode === tfr.barcode))
                .concat(this.tasksReplacedByReport);
            this.addTimelineTask(this.tasksReplacedByReport);
            this.dataSet.update(this.timelineData);
        }
        this.tooltip = false;
    }

    private validateHistoricalReport(tlTask: TimelineTask): TimelineTask {
        if (tlTask.hasHistorical && tlTask.apply === true && !this.historicalReportRelated) {
            this.updatedByUser = true;
            this.dataSet.update(this.getReportsNotSelected(tlTask, false));
            return tlTask;
        } else if (tlTask.hasHistorical && tlTask.apply === false && tlTask === this.historicalReportRelated) {
            this.updatedByUser = true;
            this.dataSet.update(this.getReportsNotSelected(tlTask, true));
            return null;
        }
        return this.historicalReportRelated;
    }

    private getReportsNotSelected(tlTask: TimelineTask, enabled: boolean): object[] {
        return this.timelineData
            .filter(i => i.task.hasHistorical && i.barcode !== tlTask.barcode)
            .map(i => {
                i.historicalEnabled = enabled;
                return i.getJson();
            });
    }
    //
    // /**
    //  * Update the reviews list for analysis
    //  * @param {Review} review
    //  */
    // private updateReview(): void {
    //     this.reviews = this._historicalReportService.reviews;
    //     // console.log(this.reviews);
    //     // const findReview = this.reviews.find(x => x.barcode === review.barcode);
    //     // if (typeof findReview === 'undefined') {
    //     //     this.reviews.push(review);
    //     // } else {
    //     //     findReview.apply = review.apply;
    //     // }
    // }

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

    // get analysis(): Analysis {
    //     return this._analysis;
    // }
    //
    // set analysis(value: Analysis) {
    //     this._analysis = value;
    // }

    // set reviews(value: Review[]) {
    //     this.analysis.reviews = value;
    // }
    //
    // get reviews(): Review[] {
    //     return this.analysis.reviews;
    // }

    get maxTime(): number {
        return this.activeTask.isClose ? this.activeTask.revisionDate.epochTime : this.activeTask.extendedDueDate.epochTime ? this.activeTask.extendedDueDate.epochTime : this.activeTask.dueDate.epochTime;
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
        return this._historicalReportRelated;
    }

    set historicalReportRelated(value: TimelineTask) {
        this._historicalReportRelated = value;
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
