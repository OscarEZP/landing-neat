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

    private static DATE_FORMAT = 'dd MMM yyyy';
    private static HOUR_FORMAT = 'HH:mm:ss';

    private _messageDataSubscription: Subscription;
    private _data: ActualTimeModel;
    private _display: boolean;
    private _alive: boolean;
    private _interval: number;
    private _currentDateLong: number;
    private _currentDateString: string;
    private _time: Date;

    constructor(private _datetimeService: DatetimeService,
                private _messageData: DataService,
                private _clockService: ClockService,
                private _sidenavService: SidenavService,
                private _routingService: RoutingService) {
        this._display = true;
        this._alive = true;
        this._interval = 60000;
        this._currentDateLong = 0;
        this._currentDateString = '';
    }

    ngOnInit() {
        this._messageDataSubscription = this._messageData.currentNumberMessage.subscribe(message => this.currentDateLong = message);
        TimerObservable.create(0, this.interval)
            .takeWhile(() => this._alive)
            .subscribe(() => {
                this._datetimeService.getTime()
                    .subscribe((data) => {
                        this.data = data;
                        this.currentDateLong = this.data.currentTimeLong;
                        this.currentDateString = this.data.currentTime;
                        this.newMessage();
                        this._clockService.setClock(this.currentDateLong);
                        if (!this.display) {
                            this.display = true;
                        }
                    });
            });
        this._clockService.getClock().subscribe(time => this.time = time);
    }

    ngOnDestroy() {
        this.alive = false;
        this._messageDataSubscription.unsubscribe();
    }

    newMessage() {
        this._messageData.changeTimeUTCMessage(this.currentDateLong);
    }

    toggleSidenav() {
        this._sidenavService.toggleSidenav().then();
    }

    get data(): ActualTimeModel {
        return this._data;
    }

    set data(value: ActualTimeModel) {
        this._data = value;
    }

    get display(): boolean {
        return this._display;
    }

    set display(value: boolean) {
        this._display = value;
    }

    get alive(): boolean {
        return this._alive;
    }

    set alive(value: boolean) {
        this._alive = value;
    }

    get interval(): number {
        return this._interval;
    }

    set interval(value: number) {
        this._interval = value;
    }

    get currentDateLong(): number {
        return this._currentDateLong;
    }

    set currentDateLong(value: number) {
        this._currentDateLong = value;
    }

    get currentDateString(): string {
        return this._currentDateString;
    }

    set currentDateString(value: string) {
        this._currentDateString = value;
    }

    get time(): Date {
        return this._time;
    }

    set time(value: Date) {
        this._time = value;
    }

    get moduleTitle() {
        return this._routingService.moduleTitle;
    }

    get hourFormat(): string {
        return ToolbarComponent.HOUR_FORMAT;
    }

    get dateFormat(): string {
        return ToolbarComponent.DATE_FORMAT;
    }

}
