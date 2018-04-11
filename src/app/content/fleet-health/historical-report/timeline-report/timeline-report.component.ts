import {Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import {HistoricalReportService} from '../_services/historical-report.service';
import * as moment from 'moment';
import {Style} from '../../../../shared/_models/style';
import {ApiRestService} from '../../../../shared/_services/apiRest.service';
import {SearchRelationedTask} from '../../../../shared/_models/task/searchRelationedTask';
import {Task} from '../../../../shared/_models/task/task';
import {DateRange} from '../../../../shared/_models/common/dateRange';
import {TimeInstant} from '../../../../shared/_models/timeInstant';
import {TimelineTask} from '../../../../shared/_models/task/timelineTask';
import {Timeline, DataSet} from 'vis';
import {Review} from '../../../../shared/_models/task/analysis/review';
import {Analysis} from '../../../../shared/_models/task/analysis/analysis';

@Component({
    selector: 'lsl-timeline-report',
    templateUrl: './timeline-report.component.html',
    styleUrls: ['./timeline-report.component.scss']
})
export class TimelineReportComponent implements OnInit, OnDestroy {

    private static DAYS_FROM = 30;
    private static DAYS_TO = 1;
    private static TASK_SEARCH_ENDPOINT = 'taskRelationsSearch';

    @Output()
    onAnalyzedTaskSelected: EventEmitter<any> = new EventEmitter();

    @Output()
    onAtaCorrected: EventEmitter<any> = new EventEmitter();

    private _tooltip: boolean;
    private _tooltipStyle: Style;
    private _timeline: Timeline;
    private _taskList: Task[];
    private _loading: boolean;
    private _error: boolean;
    private _minDate: moment.Moment;
    private _timelineTaskData: object | null;
    private _analysis: Analysis;
    private _event: object;

    constructor(
        private _translate: TranslateService,
        private _element: ElementRef,
        private _historicalReportService: HistoricalReportService,
        private _apiRestService: ApiRestService
    ) {
        this._translate.setDefaultLang('en');
        this.tooltip = false;
        this.tooltipStyle = new Style();
        this.taskList = [];
        this.timelineTaskData = null;
        this.analysis = Analysis.getInstance();
    }

    ngOnInit() {
        this.timelineData = this.getTimelineInitData();
        this.timeline = this.createTimeline(this.timelineData);
        this.event = null;
    }

    ngOnDestroy() {
    }

    private setTimelineOptions(maxTime: moment.Moment) {
        return {
            start: this.minDate.format('YYYY-MM-DD'),
            end: maxTime.format('YYYY-MM-DD'),
            zoomMin: 1000 * 60 * 60 * 24 * 30,
            zoomMax: 1000 * 60 * 60 * 24 * 30 * 12,
            max: maxTime.format('YYYY-MM-DD'),
            min: this.minDate.format('YYYY-MM-DD'),
            stack: false,
        };
    }

    private createTimeline(data: TimelineTask[]): Timeline {
        data = this.getExtraTime(data)
            .map(task => task.getJson());

        const items = new DataSet(data);
        const dataMinDate = this.taskList
            .sort((a, b) => a.createEpochTime < b.createEpochTime ? 1 : -1)
            .shift();
        this.minDate = moment(dataMinDate ? dataMinDate.createEpochTime : this.activeTask.createEpochTime).utc().subtract(TimelineReportComponent.DAYS_FROM, 'days');

        let timeline: Timeline;
        if (this.timeline) {
            this.tooltip = false;
            timeline = this.timeline;
            timeline.setData({items: items});
        } else {
            timeline = this.getNewTimeline(items);
        }
        if (this.timelineData.length > 0) {
            timeline.setGroups(this.getGroups(this.timelineData));
        }
        return timeline;
    }

    private getGroups(data: TimelineTask[]): DataSet<object> {
        const arr = data.map(item => {
            return {
                id: item.barcode,
                content: item.barcode,
                subgroupStack: {
                    subgroup: false
                }
            };
        });
        return new DataSet(arr);
    }

    private getNewTimeline(items: DataSet<object>): Timeline {
        const maxTime = moment(this.maxTime).utc().add(TimelineReportComponent.DAYS_TO, 'days');
        const options = this.setTimelineOptions(maxTime);
        const timeline = new Timeline(this.element.nativeElement, items, options);

        timeline.on('click', (event: object) => {
            this.event = event;
            this.tooltip = false;
            this.getTimelineItem();
            this.showTooltip();
            if (this.timelineTaskData !== null && !this.timelineTaskData['data']['active']) {
                this.onAnalyzedTaskSelected.emit(this.timelineTaskData['data']);
            }
        });
        timeline.on('rangechange', () => {
            this.showTooltip();
        });
        return timeline;
    }

    private getExtraTime(data: TimelineTask[]): TimelineTask[] {
        let arrExtra = [];
        data.forEach(item => {
            arrExtra.push(item);
            if (item.getExtraTime().length > 0) {
                arrExtra = arrExtra.concat(item.getExtraTime());
            }
        });
        return arrExtra;
    }

    private getTimelineItem(): object | null {
        const items = this.timeline['itemSet']['items'];
        const arrItems = Object
            .keys(items)
            .map(key => items[key] && items[key].selected ? items[key] : false)
            .filter(item => item !== false);
        this.timelineTaskData = arrItems.length > 0 ? arrItems[0] : null;
        return this.timelineTaskData;
    }

    private getTimelineInitData(): TimelineTask[] {
        return [new TimelineTask(this.activeTask, true)];
    }

    /**
     * Subscription for get a data list
     * @param signature
     * @return {Subscription}
     */
    private getListSubscription(signature: SearchRelationedTask): Subscription {
        this.loading = true;
        return this._apiRestService.search<Task[]>(TimelineReportComponent.TASK_SEARCH_ENDPOINT, signature).subscribe(
            (list) => {
                this.taskList = list;
                this.loading = false;
            },
            () => this.getError()
        );
    }

    public checkCorrectedATA(result: boolean) {
        if (result) {
            const signature: SearchRelationedTask = SearchRelationedTask.getInstance();

            signature.tail = this.activeTask.tail;
            signature.ataGroup = this.activeTask.ata;
            signature.barcode = this.activeTask.barcode;

            const endDate = this.activeTask.createEpochTime;
            const initDate = moment(endDate).utc().subtract(TimelineReportComponent.DAYS_FROM, 'days').valueOf();

            signature.dateRange = new DateRange(new TimeInstant(initDate, ''), new TimeInstant(endDate, ''));
            this.getListSubscription(signature).add(() => {
                this.timelineData = this.taskList.map(task => {
                    return new TimelineTask(task, task.id === this.activeTask.id, true, this.validateApply(task.review));
                });
                const findTask = this.timelineData.find(value => value.barcode === this.activeTask.barcode);

                if (typeof findTask === 'undefined') {
                    this.timelineData.push(new TimelineTask(this.activeTask, true, true));
                }
                this.timeline = this.createTimeline(this.timelineData);
                this.onAtaCorrected.emit(result);
            });
        }
    }

    private validateApply(review: Review): boolean {
        let apply: boolean = null;
        if (review != null) {
            if (review.apply) {
                this.updateReview(review);
            }
            apply = review.apply;
        }
        return apply;

    }

    public getTooltipStyle(): Style {
        const item = this.timelineTaskData;
        if (item) {
            const correctionLeft = this.timeline['body']['dom']['left']['clientWidth'];
            this.tooltipStyle.top = this.event['y'] + 'px';
            this.tooltipStyle.left = (item['left'] + correctionLeft) + 'px';
            this.tooltipStyle.display = item['left'] <= 0 ? 'none' : 'block';
        }
        return this.tooltipStyle;
    }

    public showTooltip() {
        this.tooltip = !!(this.getTimelineItem() && !this.getTimelineItem()['data']['active']);
    }

    public refreshOnApply(review: Review) {
        let updatedTimelineTask = TimelineTask.getInstance();
        const newData = this.timelineData.map(item => {
            if (item.task.barcode === review.barcode) {
                updatedTimelineTask = new TimelineTask(item.task, false, false, review.apply === true);
                return updatedTimelineTask;
            } else {
                return item;
            }
        });
        this.timelineData = newData;
        this.timeline = this.createTimeline(newData);
        this.updateReview(review);
        this.onAnalyzedTaskSelected.emit(updatedTimelineTask);
    }


    /**
     * Update review method
     */
    private updateReview(review: Review): void {

        const findReview = this.reviews.find(x => x.barcode === review.barcode);
        if (typeof findReview === 'undefined') {
            this.reviews.push(review);
        } else {
            findReview.apply = review.apply;
        }
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

    get timelineTaskData(): object | null {
        return this._timelineTaskData;
    }

    set timelineTaskData(value: object | null) {
        this._timelineTaskData = value;
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

    get analysis(): Analysis {
        return this._analysis;
    }

    set analysis(value: Analysis) {
        this._analysis = value;
    }

    get reviews(): Review[] {
        return this.analysis.reviews;
    }

    get maxTime(): number {
        return this.activeTask.isClose ? this.activeTask.revisionDate.epochTime : this.activeTask.extendedDueDate.epochTime ? this.activeTask.extendedDueDate.epochTime : this.activeTask.dueDate.epochTime;
    }

    get event(): object {
        return this._event;
    }

    set event(value: object) {
        this._event = value;
    }
}
