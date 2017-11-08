import {OnDestroy, AfterContentInit, Component, OnInit} from '@angular/core';
import {DatetimeService} from "../../commons/datatime.service/datetime.service";
import {ActualTimeModel} from "../../commons/datatime.service/actual-time-model";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import { Observable } from "rxjs";

@Component({
    selector: 'lsl-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, AfterContentInit, OnDestroy {

    private data: ActualTimeModel;
    private display: boolean;
    private alive: boolean;
    private interval: number;
    public currentDate: number;

    constructor(private datetimeService:DatetimeService) {
        this.display = false;
        this.alive = true;
        this.interval = 500000;
        this.currentDate = 0;
    }

    ngOnInit() {
        this.currentDate = 0;
    }

    ngAfterContentInit() {
        TimerObservable.create(0, this.interval)
            //.takeWhile(() => this.alive)
            .subscribe(() => {
                this.datetimeService.getTime()
                    .subscribe((data) => {
                        this.data = data;
                        this.currentDate = this.data.currentTimeLong;
                        if(!this.display){
                            this.display = true;
                        }
                    });
            });
    }

    ngOnDestroy() {
        this.alive = false;
    }

}
