import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { DataSet, Timeline} from 'vis';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
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

@Component({
    selector: 'lsl-timeline-report',
    templateUrl: './timeline-report.component.html',
    styleUrls: ['./timeline-report.component.scss']
})
export class TimelineReportComponent implements OnInit, OnDestroy {

    private static DAYS_FROM = 30;
    private static DAYS_TO = 1;
    private static TASK_SEARCH_ENDPOINT = 'taskRelationsSearch';

    private _data$: Observable<any>;
    private _dataSub: Subscription;
    private _data: {id: number, content: string, start: string}[];
    private _tooltip: boolean;
    private _tooltipStyle: Style;
    private _timeline: any;
    private _list: Task[];
    private _loading: boolean;
    private _error: boolean;

    constructor(
        private _translate: TranslateService,
        private _element: ElementRef,
        private _fleetHealthService: FleetHealthService,
        private _apiRestService: ApiRestService,
    ) {
        this._translate.setDefaultLang('en');
        this.tooltip = false;
        this.tooltipStyle = new Style();
    }

    ngOnInit(): void {
        this._data$ = this.getData$();
        this._dataSub = this._data$
        .subscribe(data => this._data = data)
        .add(this.createTimeline());
    }

    ngOnDestroy(): void {
        this._dataSub.unsubscribe();
    }

    private createTimeline(): void {
        const items = new DataSet(this._data);
        const options = {
            start: moment(this._fleetHealthService.task.createDate.epochTime).utc().subtract(TimelineReportComponent.DAYS_FROM, 'days').format('YYYY-MM-DD'),
            end: moment(this._fleetHealthService.task.createDate.epochTime).utc().add(TimelineReportComponent.DAYS_TO, 'days').format('YYYY-MM-DD'),
            zoomMin: 1000 * 60 * 60 * 24 * 31,
            zoomMax: 1000 * 60 * 60 * 24 * 31 * 12,
            max: moment(this._fleetHealthService.task.createDate.epochTime).utc().add(TimelineReportComponent.DAYS_TO, 'days').format('YYYY-MM-DD')
        };
        this._timeline = new Timeline(this._element.nativeElement, items, options);
        this._timeline.on('click', (event) => this.showTooltip(event));
        this._timeline.on('rangechange', event => this.showTooltip(event));
    }

    private getTimelineItem(): object | null {
        const items = this._timeline['itemSet']['items'];
        const arrItems = Object
        .keys(items)
        .map(key => items[key] && items[key].selected ? items[key] : false)
        .filter(item => item !== false);
        return arrItems ? arrItems[0] : null;
    }

    private getData$(): Observable<any> {
        return new Observable<any> (suscriber => {
            const datePipe = new DatePipe('en');
            const timelineTask = new TimelineTask(this._fleetHealthService.task.id, this._fleetHealthService.task, datePipe.transform(this._fleetHealthService.task.createDate.epochTime, 'yyyy-MM-dd')).getJson();
            const data = [
                timelineTask,
                {id: 2, content: 'item 2', start: '2018-01-04'},
                {id: 3, content: 'item 3', start: '2018-01-08'},
                {id: 4, content: 'item 4', start: '2018-01-06', end: '2018-01-09'},
                {id: 5, content: 'item 5', start: '2018-01-05'},
                {id: 6, content: 'item 6', start: '2018-01-07'}
            ];
            suscriber.next(data);
            suscriber.complete();
        });
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

                this.list = list;
                console.log('list', list);
                this._loading = false;
            },
            () => this.getError()
        );
    }

    public checkCorrectedATA (value: boolean) {

        const signature: SearchRelationedTask  = SearchRelationedTask.getInstance();

        signature.tail = this._fleetHealthService.task.tail;
        signature.ataGroup = this._fleetHealthService.task.ata;

        const currentDate = new Date();

        const endDate = moment(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())).utc().valueOf();
        const initDate = moment(endDate).utc().subtract(TimelineReportComponent.DAYS_FROM, 'days').valueOf();

        signature.dateRange = new DateRange(new TimeInstant(initDate, ''), new TimeInstant(endDate, ''));
        this.getListSubscription(signature);

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
        this.tooltip = this.getTimelineItem() ? true : false;
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

    get list(): Task[] {
        return this._list;
    }

    set list(value: Task[]) {
        this._list = value;
    }

    get error(): boolean {
        return this._error;
    }

    set error(value: boolean) {
        this._error = value;
    }

}
