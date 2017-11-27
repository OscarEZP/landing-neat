import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatetimeService } from '../../shared/_services/datetime.service';
import { ActualTimeModel } from '../../shared/_models/actual-time-model';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import 'rxjs/add/operator/takeWhile';
import { DataService } from '../../shared/_services/data.service';
import { Subscription } from 'rxjs/Subscription';
import { ClockService } from '../../shared/_services/clock.service';
import { SidenavService } from '../_services/sidenav.service';
import { DialogService } from '../../content/_services/dialog.service';
import { ContingencyFormComponent } from '../../content/operations/contingency-form/contingency-form.component';
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
    private display: boolean;
    private alive: boolean;
    private interval: number;
    public currentDateLong: number;
    public currentDateString: string;
    private time: Date;
    private moduleTitle: string;

    constructor(
        private datetimeService: DatetimeService,
        private messageData: DataService,
        private clockService: ClockService,
        private sidenavService: SidenavService,
        private dialogService: DialogService,
        private routingService: RoutingService
    ) {
        this.display = true;
        this.alive = true;
        this.interval = 60000;
        this.currentDateLong = 0;
        this.currentDateString = '';
        this.moduleTitle = '';
    }

    openDialog() {
        this.dialogService.openDialog(ContingencyFormComponent);
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

        this.moduleTitle = this.routingService.getModuleTitle();

    }

    ngOnDestroy() {
        this.alive = false;
        this._messageDataSubscription.unsubscribe();
    }

    newMessage() {
        this.messageData.changeNumberMessage(this.currentDateLong);
    }

    toggleSidenav() {
        this.sidenavService.toggleSidenav().then();
    }

}
