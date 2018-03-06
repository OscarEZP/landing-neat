import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatetimeService } from '../../shared/_services/datetime.service';
import { ActualTimeModel } from '../../shared/_models/actualTime';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import 'rxjs/add/operator/takeWhile';
import { DataService } from '../../shared/_services/data.service';
import { Subscription } from 'rxjs/Subscription';
import { ClockService } from '../../shared/_services/clock.service';
import { SidenavService } from '../_services/sidenav.service';
import { RoutingService } from '../../shared/_services/routing.service';

@Component({
    selector: 'lsl-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    providers: [ClockService]
})
export class ToolbarComponent implements OnInit, OnDestroy {

    private _messageDataSubscription: Subscription;
    private data: ActualTimeModel;
    public display: boolean;
    private alive: boolean;
    private interval: number;
    public currentDateLong: number;
    public currentDateString: string;
    public time: Date;
    public moduleTitle: string;

    constructor(private datetimeService: DatetimeService,
                private messageData: DataService,
                private clockService: ClockService,
                private sidenavService: SidenavService,
                public routingService: RoutingService) {
        this.display = true;
        this.alive = true;
        this.interval = 60000;
        this.currentDateLong = 0;
        this.currentDateString = '';
        this.moduleTitle = '';
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
                        if (!this.display) {
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
        this.messageData.changeTimeUTCMessage(this.currentDateLong);
    }

    toggleSidenav() {
        this.sidenavService.toggleSidenav().then();
    }
}
