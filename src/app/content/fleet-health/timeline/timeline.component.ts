import {Component, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import { MessageService } from '../../../shared/_services/message.service';
import { DialogService } from '../../_services/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import * as vis from 'vis';
import {Task} from '../../../shared/_models/task/task';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {TimelineTooltipComponent} from '../timeline-tooltip/timeline-tooltip.component';

@Component({
    selector: 'lsl-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, OnDestroy {

    @Input() task: Task;

    private _data$: Observable<any>;
    private _dataSub: Subscription;
    private _data: TimelineData[];

    constructor(
        private _messageService: MessageService,
        private _dialogService: DialogService,
        private _translate: TranslateService,
        private _element: ElementRef,
        private _timelineTooltipComponent: TimelineTooltipComponent
    ) {
        this._translate.setDefaultLang('en');
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
        const timeline = new vis.Timeline(this._element.nativeElement, items, options);
        timeline.on('click', (event) => {
            // this.tooltipStyle.left = event['x'];
            // this.tooltipStyle.top = event['y'];
            // console.log(timeline);
            // console.log(timeline['itemSet']['selection']);
            // // console.log(timeline['itemSet']);
            // //
            //
            this.showTooltip(event);
        });
        timeline.on('contextmenu', function (props) {
            console.log('Right click!');
            props.event.preventDefault();
        });

        // const tooltipStyle = this.tooltipStyle;
        // timeline.on('rangechange', function (event) {
        //     console.log('Dragging!', timeline['itemSet'].items[1].left);
        //     tooltipStyle.left = timeline['itemSet'].items[1].left;
        // });
    }

    private getData$(): Observable<any> {
        const obs$ = new Observable<any> (suscriber => {
            const data = [
                {id: 1, content: 'item 1', start: '2013-04-20'},
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
        this._timelineTooltipComponent.show(event);
    }
}

export class TimelineData {
    private _id: number;
    private _content: string;
    private _start: string;

    constructor(id: number, content: string, start: string) {
        this._id = id;
        this._content = content;
        this._start = start;
    }

    static getInstance(): TimelineData {
        return new TimelineData(0, '', '');
    }
}
