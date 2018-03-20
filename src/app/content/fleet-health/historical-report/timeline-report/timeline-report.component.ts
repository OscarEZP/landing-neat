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
    private _timeline: any;
    private _taskList: Task[];
    private _loading: boolean;
    private _error: boolean;
    private _minDate: any;
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
        this.selectedTask = Task.getInstance();
    }

    ngOnInit() {
        this._timelineData = this.getTimelineData();
        this._timeline = this.createTimeline(this._timelineData);
    }

    ngOnDestroy() {
    }

    private createTimeline(data: TimelineTask[]): Timeline {
        const items = new DataSet(data);
        this._minDate = moment(this._fleetHealthService.task.createDate.epochTime).utc().subtract(TimelineReportComponent.DAYS_FROM, 'days');
        const maxTime = moment(this._fleetHealthService.task.dueDate.epochTime).utc().add(TimelineReportComponent.DAYS_TO, 'days');
        const options = {
            start: this._minDate.format('YYYY-MM-DD'),
            end: maxTime.format('YYYY-MM-DD'),
            zoomMin: 1000 * 60 * 60 * 24 * 31,
            zoomMax: 1000 * 60 * 60 * 24 * 31 * 12,
            max: maxTime.format('YYYY-MM-DD'),
            min: this._minDate.format('YYYY-MM-DD')
        };
        const timeline = new Timeline(this._element.nativeElement, items, options);
        timeline.redraw();
        timeline.on('click', (event) => this.showTooltip(event));
        timeline.on('rangechange', event => this.showTooltip(event));
        return timeline;
    }

    private getTimelineItem(): object | null {
        const items = this._timeline['itemSet']['items'];
        const arrItems = Object
        .keys(items)
        .map(key => items[key] && items[key].selected ? items[key] : false)
        .filter(item => item !== false);
        this.selectedTask = arrItems ? arrItems[0] : null;
        return this.selectedTask;
    }

    private getTimelineData(): TimelineTask[] {
        const timelineTask = new TimelineTask(this._fleetHealthService.task, true).getJson();
        return [timelineTask];
    }

    /**
     * Subscription for get the data list
     * @param signature
     * @return {Subscription}
     */
    private getListSubscription(signature: SearchRelationedTask): Subscription {
        this._loading = true;
        return this._apiRestService.search<Task[]>(TimelineReportComponent.TASK_SEARCH_ENDPOINT, signature).subscribe(
            (list) => {
                this.taskList = list;
                this._loading = false;
            },
            () => this.getError()
        );
    }

    public checkCorrectedATA (value: boolean) {

        const signature: SearchRelationedTask  = SearchRelationedTask.getInstance();

        signature.tail = this._fleetHealthService.task.tail;
        signature.ataGroup = this._fleetHealthService.task.ata;

        const endDate = this._fleetHealthService.task.createDate.epochTime;
        const initDate = moment(endDate).utc().subtract(TimelineReportComponent.DAYS_FROM, 'days').valueOf();

        signature.dateRange = new DateRange(new TimeInstant(initDate, ''), new TimeInstant(endDate, ''));
        this.getListSubscription(signature).add(() => {
            const arr = this.taskList.map(task => {
                return new TimelineTask(task, task.id === this._fleetHealthService.task.id, true).getJson();
            });
            this._timeline.destroy();
            this._timeline = this.createTimeline(arr);
        });

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

    public showTooltip(event: Event) {
        this.tooltip = this.getTimelineItem() && !this.getTimelineItem()['data']['active'] ? true : false;
    }

    /**
     * Handler for error process on api request
     * @return {boolean}
     */
    private getError(): boolean {
        this._loading = false;
        return this._error = true;
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
}
