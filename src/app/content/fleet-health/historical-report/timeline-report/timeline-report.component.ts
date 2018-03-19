import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import * as vis from 'vis';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {FleetHealthService} from '../../_services/fleet-health.service';
import * as moment from 'moment';
import {Style} from '../../../../shared/_models/style';
import {ApiRestService} from "../../../../shared/_services/apiRest.service";
import {SearchRelationedTask} from "../../../../shared/_models/task/searchRelationedTask";
import {Task} from "../../../../shared/_models/task/task";
import {DateRange} from "../../../../shared/_models/common/dateRange";
import {TimeInstant} from "../../../../shared/_models/timeInstant";
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

    ngOnInit() {
        this._data$ = this.getData$();
        this._dataSub = this._data$
        .subscribe(data => this._data = data)
        .add(this.createTimeline())
        ;
    }

    ngOnDestroy() {
        this._dataSub.unsubscribe();
    }

    private createTimeline() {
        const items = new vis.DataSet(this._data);
        const options = {
            start: moment(this._fleetHealthService.task.createDate.epochTime).utc().subtract(TimelineReportComponent.DAYS_FROM, 'days').format('YYYY-MM-DD'),
            end: moment(this._fleetHealthService.task.createDate.epochTime).utc().add(TimelineReportComponent.DAYS_TO, 'days').format('YYYY-MM-DD')
        };
        this._timeline = new vis.Timeline(this._element.nativeElement, items, options);
        this._timeline.on('click', (event) => this.showTooltip(event));
        this._timeline.on('rangechange', event => {
            this.showTooltip(event);
        });
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
        const obs$ = new Observable<any> (suscriber => {
            const datePipe = new DatePipe('en');
            console.log(this._fleetHealthService.task);

            const data = [
                {id: 1, content: 'item 1 <p>algo</p>', start: datePipe.transform(this._fleetHealthService.task.createDate.epochTime, 'yyyy-MM-dd')},
            ];
            suscriber.next(data);
            suscriber.complete();
        });
        return obs$;
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
                console.log('list',list);
                this._loading = false;
            },
            () => this.getError()
        );
    }

    public checkCorrectedATA (value:boolean){

        const signature:SearchRelationedTask  = SearchRelationedTask.getInstance();

        signature.tail=this._fleetHealthService.task.tail;
        signature.ataGroup=this._fleetHealthService.task.ata;

        const currentDate = new Date();

        const endDate = moment(new Date(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate())).utc().valueOf();
        const initDate = moment(endDate).utc().subtract(TimelineReportComponent.DAYS_FROM, 'days').valueOf();

        signature.dateRange=new DateRange(new TimeInstant(initDate,''),new TimeInstant(endDate,''));
        this.getListSubscription(signature);

    }
    public showTooltip(event: Event) {
        const item = this.getTimelineItem();
        const correction = 18;
        if (item) {
            this.tooltipStyle.bottom = (item['top'] - correction) + 'px';
            this.tooltipStyle.left = item['dom']['box']['style']['left'];
            this.tooltip = true;
        } else {
            this.tooltip = false;
        }
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
