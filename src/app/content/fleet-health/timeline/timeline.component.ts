import {Component, ElementRef, Input, OnInit} from '@angular/core';
import { MessageService } from '../../../shared/_services/message.service';
import { DialogService } from '../../_services/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import * as vis from 'vis';
import {Task} from '../../../shared/_models/task/task';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {tap} from 'rxjs/operators';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

@Component({
    selector: 'lsl-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

    @Input() task: Task;

    private _data$: Observable<any>;
    private _dataSub: Subscription;

    constructor(
        private messageService: MessageService,
        private dialogService: DialogService,
        public translate: TranslateService,
        private element: ElementRef
    ) {
        this.translate.setDefaultLang('en');
    }

    ngOnInit() {
        // console.log(this.task);
        const items = new vis.DataSet();
        this._data$ = this.getData$();
        this._dataSub = this._data$.subscribe();

        // Configuration for the Timeline
        const options = null;

        // Create a Timeline
        const timeline = new vis.Timeline(this.element.nativeElement, items, options);
        timeline.on('click', (event) => {
            // this.tooltipStyle.left = event['x'];
            // this.tooltipStyle.top = event['y'];
            // console.log(timeline);
            // console.log(timeline['itemSet']['selection']);
            // // console.log(timeline['itemSet']);
            // //
            //
            // this.showTooltip(event);
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
        const obs$ = new Observable<any> (suscriber => suscriber.next([
            {id: 1, content: 'item 1', start: '2013-04-20'},
            {id: 2, content: 'item 2', start: '2013-04-14'},
            {id: 3, content: 'item 3', start: '2013-04-18'},
            {id: 4, content: 'item 4', start: '2013-04-16', end: '2013-04-19'},
            {id: 5, content: 'item 5', start: '2013-04-25'},
            {id: 6, content: 'item 6', start: '2013-04-27'}
        ]));
        return obs$
        // .pipe(
        //     tap(algo => algo)
        // )
        // .map(item => {
        //     console.log('for', item);
        //     return item;
        // })
        .map(
            item => {
                // item.id > 3;
                const ix = item.filter(i => i.id > 5);
                console.log('filter', ix);
                return ix;
                // return item;
            }
        )
            ;
    }

    closeCancelDialog() {
        this.messageService.dismissSnackBar();
    }

    closeContingencyForm() {
        this.dialogService.closeAllDialogs();
        this.closeCancelDialog();
    }
}
