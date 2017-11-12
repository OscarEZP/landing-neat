import {Component, OnDestroy, OnInit} from '@angular/core';
import {DatetimeService} from "../../commons/datatime.service/datetime.service";
import {ActualTimeModel} from "../../commons/datatime.service/actual-time-model";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import 'rxjs/add/operator/takeWhile';
import {DataService} from "../../commons/data.service/data.service";
import {Subscription} from "rxjs/Subscription";
import {ClockService} from "../../commons/clock.service/clock.service";
import { SidenavService } from '../_services/sidenav.service'

@Component({
    selector: 'lsl-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.css'],
    providers: [ClockService]
})
export class ToolbarComponent implements OnInit, OnDestroy {

    private _messageDataSubscription: Subscription;
    private data: ActualTimeModel;
    private display: boolean;
    private alive: boolean;
    private interval: number;
    public currentDateLong: number;
    public currentDateString: string;
    private time: Date;

    constructor(
        private datetimeService:DatetimeService,
        private messageData: DataService,
        private clockService: ClockService,
        private sidenavService: SidenavService
    ) {
        this.display = false;
        this.alive = true;
        this.interval = 60000;
        this.currentDateLong = 0;
        this.currentDateString = "";
    }

    ngOnInit() {

        this._messageDataSubscription = this.messageData.currentNumberMessage.subscribe(message => this.currentDateLong = message);

        TimerObservable.create(0, this.interval)
            .takeWhile(() => this.alive)
            .subscribe(() => {
                this.datetimeService.getTime()
                    .subscribe((data) => {
                        this.data = data;
                        this.currentDateLong = this.data.currentTimeLong;
                        this.currentDateString = this.data.currentTime;
                        this.newMessage();
                        this.clockService.setClock(this.currentDateLong);
                        if(!this.display){
                            this.display = true;
                        }
                    });
            });

        this.clockService.getClock().subscribe(time => this.time = time);
    }

    ngOnDestroy() {
        this.alive = false;
        this._messageDataSubscription.unsubscribe();
    }

    newMessage() {
        this.messageData.changeNumberMessage(this.currentDateLong);
    }

    toggleSidenav() {
        this.sidenavService.toggleSidenav().then(() => {
            console.log('toggle sidenav!');
        });
    }

}
