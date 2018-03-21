import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import {FleetHealthService} from '../../_services/fleet-health.service';
import * as moment from 'moment';
import {Style} from '../../../../shared/_models/style';
import {ApiRestService} from '../../../../shared/_services/apiRest.service';
import {SearchRelationedTask} from '../../../../shared/_models/task/searchRelationedTask';
import {Task} from '../../../../shared/_models/task/task';
import {DateRange} from '../../../../shared/_models/common/dateRange';
import {TimeInstant} from '../../../../shared/_models/timeInstant';
import {TimelineTask} from '../../../../shared/_models/task/timelineTask';
import {Timeline, DataSet} from 'vis';
import {Analysis} from '../../../../shared/_models/task/analysis/analysis';
import {Moment} from 'moment';

@Component({
    selector: 'lsl-timeline-report',
    templateUrl: './timeline-report.component.html',
    styleUrls: ['./timeline-report.component.scss']
})
export class TimelineReportComponent implements OnInit, OnDestroy {

    private static DAYS_FROM = 30;
    private static DAYS_TO = 1;
    private static TASK_SEARCH_ENDPOINT = 'taskRelationsSearch';

    private _timelineData: TimelineTask[];
    private _tooltip: boolean;
    private _tooltipStyle: Style;
    private _timeline: Timeline;
    private _taskList: Task[];
    private _loading: boolean;
    private _error: boolean;
    private _minDate: Moment;
    private _selectedTask: Task | null;

    constructor(
        private _translate: TranslateService,
        private _element: ElementRef,
        private _fleetHealthService: FleetHealthService,
        private _apiRestService: ApiRestService,
    ) {
        this._translate.setDefaultLang('en');
        this.tooltip = false;
        this.tooltipStyle = new Style();
        this.taskList = [];
        this.selectedTask = null;
    }

    ngOnInit() {
        this.timelineData = this.getTimelineInitData();
        this.timeline = this.createTimeline(this.timelineData);
    }

    ngOnDestroy() {
    }

    private createTimeline(data: TimelineTask[]): Timeline {
        // data = this.getExtraTime(data).map(task => task.getJson());
        data = data
        // .getExtraTime(data)
        .map(task => task.getJson());

        console.log(data);
        const items = new DataSet(data);
        const dataMinDate = this.taskList
        .sort((a, b) => a.createEpochTime < b.createEpochTime ? 1 : -1)
        .shift();
        this.minDate = moment(dataMinDate ? dataMinDate.createEpochTime : this.createDateEpochtime).utc().subtract(TimelineReportComponent.DAYS_FROM, 'days');
        const maxTime = moment(this.dueDateEpochtime).utc().add(TimelineReportComponent.DAYS_TO, 'days');
        const options = {
            start: this.minDate.format('YYYY-MM-DD'),
            end: maxTime.format('YYYY-MM-DD'),
            zoomMin: 1000 * 60 * 60 * 24 * 31,
            zoomMax: 1000 * 60 * 60 * 24 * 31 * 12,
            max: maxTime.format('YYYY-MM-DD'),
            min: this.minDate.format('YYYY-MM-DD')
        };

        let timeline: Timeline;

        // console.log(this.getExtraTime(data));

        if (this.timeline) {
            this.tooltip = false;
            timeline = this.timeline;
            timeline.setData({items: items});
        } else {
            timeline = new Timeline(this.element.nativeElement, items, options);
        }

        timeline.on('click', (event) => this.showTooltip());
        timeline.on('rangechange', event => this.showTooltip());
        return timeline;
    }

    private getExtraTime(data: TimelineTask[]): TimelineTask[] {
        let arrExtra = [];
        data.forEach(item => {
            if (item.getExtraTime().length > 0) {
                arrExtra = data.concat(arrExtra);
            }
        } );
        return arrExtra;
    }

    private getTimelineItem(): object | null {
        const items = this.timeline['itemSet']['items'];
        const arrItems = Object
        .keys(items)
        .map(key => items[key] && items[key].selected ? items[key] : false)
        .filter(item => item !== false);
        this.selectedTask = arrItems ? arrItems[0] : null;
        return this.selectedTask;
    }

    private getTimelineInitData(): TimelineTask[] {
        const timelineTask = new TimelineTask(this.activeTask, true);
        return [timelineTask];
    }

    /**
     * Subscription for get the data list
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

    public checkCorrectedATA (result: boolean) {
        if (result) {
            const signature: SearchRelationedTask = SearchRelationedTask.getInstance();

            signature.tail = this.activeTask.tail;
            signature.ataGroup = this.activeTask.ata;

            const endDate = this.createDateEpochtime;
            const initDate = moment(endDate).utc().subtract(TimelineReportComponent.DAYS_FROM, 'days').valueOf();

            signature.dateRange = new DateRange(new TimeInstant(initDate, ''), new TimeInstant(endDate, ''));
            this.getListSubscription(signature).add(() => {
                this.timelineData = this.taskList.map(task => {
                    return new TimelineTask(task, task.id === this.activeTask.id, true);
                });
                this.timeline = this.createTimeline(this.timelineData);
            });
        }
    }

    public getTooltipStyle(): Style {
        const item = this.getTimelineItem();
        if (item) {
            const correction = 18;
            this.tooltipStyle.bottom = (item['top'] - correction) + 'px';
            this.tooltipStyle.left = item['dom']['box']['style']['left'];
        }
        return this.tooltipStyle;
    }

    public showTooltip() {
        this.tooltip = !!(this.getTimelineItem() && !this.getTimelineItem()['data']['active']);
    }

    public refreshOnApply(analysis: Analysis) {

        const updatedTask = this.timelineData
        .filter(item => item.task.barcode === analysis.barcode)
        .map(item => {
            return new TimelineTask(item.task, false, false, analysis.status === 'apply');
        })[0];

        const newData = this.timelineData.filter(task => task.id !== updatedTask.task.id);
        newData.push(updatedTask);
        this.timelineData = newData;
        this.timeline = this.createTimeline(newData);
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

    get selectedTask(): Task {
        return this._selectedTask;
    }

    set selectedTask(value: Task) {
        this._selectedTask = value;
    }

    get timelineData(): TimelineTask[] {
        return this._timelineData;
    }

    set timelineData(value: TimelineTask[]) {
        this._timelineData = value;
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

    get minDate(): Moment {
        return this._minDate;
    }

    set minDate(value: Moment) {
        this._minDate = value;
    }

    get activeTask(): Task {
        return this._fleetHealthService.task;
    }

    get element(): ElementRef {
        return this._element;
    }

    get createDateEpochtime() {
        return this._fleetHealthService.createDateEpochtime;
    }

    get dueDateEpochtime() {
        return this._fleetHealthService.dueDateEpochtime;
    }


}
