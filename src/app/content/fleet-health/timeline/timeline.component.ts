import {Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import { MessageService } from '../../../shared/_services/message.service';
import { DialogService } from '../../_services/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import * as vis from 'vis';
import {Task} from '../../../shared/_models/task/task';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
    selector: 'lsl-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnDestroy {

    @Input() task: Task;

    private _data$: Observable<any>;
    private _dataSub: Subscription;
    private _data: {id: number, content: string, start: string}[];
    private _tooltip: boolean;
    private _tooltipStyle: {top: string, left: string};
    private _timeline: any;
    private _timelineItem: any;

    constructor(
        private _messageService: MessageService,
        private _dialogService: DialogService,
        private _translate: TranslateService,
        private _element: ElementRef,
    ) {
        this._translate.setDefaultLang('en');
        this.tooltip = false;
        this.tooltipStyle = {
            top: '50px',
            left: '150px'
        };
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
        // Configuration for the Timeline
        const options = null;
        // Create a Timeline
        this._timeline = new vis.Timeline(this._element.nativeElement, items, options);
        this._timeline.on('click', (event) => this.showTooltip(event));

        const tooltipStyle = this.tooltipStyle;
        this._timeline.on('rangechange', event => {
            this.showTooltip(event);
            // const item = this.getTimelineItem();
            // this.tooltipStyle.left = item ? item['left'] + 'px' : '';
            // this.tooltipStyle.top = item ? item['top'] + 'px' : '';
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
            const data = [
                {id: 1, content: 'item 1 <p>algo</p>', start: '2013-04-20'},
                {id: 2, content: 'item 2', start: '2013-04-14'},
                {id: 3, content: 'item 3', start: '2013-04-18'},
                {id: 4, content: 'item 4', start: '2013-04-16', end: '2013-04-19'},
                {id: 5, content: 'item 5', start: '2013-04-25'},
                {id: 6, content: 'item 6', start: '2013-04-27'}
            ];
            suscriber.next(data);
            suscriber.complete();
        });
        return obs$;
    }

    public showTooltip(event: Event) {
        const timelineLabelHeight = 40;
        const item = this.getTimelineItem();
        if (item) {
            console.log(item);
            this.tooltipStyle.top = parseInt(item['dom']['box']['style']['top'], 0) + timelineLabelHeight + 'px';
            this.tooltipStyle.left = item['dom']['box']['style']['left'];
            this.tooltip = true;
        }
    }


    get tooltip(): boolean {
        return this._tooltip;
    }

    set tooltip(value: boolean) {
        this._tooltip = value;
    }

    get tooltipStyle(): { top: string; left: string; } {
        return this._tooltipStyle;
    }

    set tooltipStyle(value: { top: string; left: string; }) {
        this._tooltipStyle = value;
    }
}

// export class TimelineData {
//     private _id: number;
//     private _content: string;
//     private _start: string;
//
//     constructor(id: number, content: string, start: string) {
//         this._id = id;
//         this._content = content;
//         this._start = start;
//     }
//
//     static getInstance(): TimelineData {
//         return new TimelineData(0, '', '');
//     }
// }
