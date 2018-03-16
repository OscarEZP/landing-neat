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

@Component({
    selector: 'lsl-timeline-report',
    templateUrl: './timeline-report.component.html',
    styleUrls: ['./timeline-report.component.scss']
})
export class TimelineReportComponent implements OnInit, OnDestroy {

    private static DAYS_FROM = 30;
    private static DAYS_TO = 2;

    private _data$: Observable<any>;
    private _dataSub: Subscription;
    private _data: {id: number, content: string, start: string}[];
    private _tooltip: boolean;
    private _tooltipStyle: Style;
    private _timeline: any;

    constructor(
        private _translate: TranslateService,
        private _element: ElementRef,
        private _fleetHealthService: FleetHealthService
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
            console.log(datePipe.transform(this._fleetHealthService.task.createDate.epochTime, 'yyyy-MM-dd'));
            const data = [
                {id: 1, content: 'item 1 <p>algo</p>', start: datePipe.transform(this._fleetHealthService.task.createDate.epochTime, 'yyyy-MM-dd')},
            ];
            suscriber.next(data);
            suscriber.complete();
        });
        return obs$;
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
}
