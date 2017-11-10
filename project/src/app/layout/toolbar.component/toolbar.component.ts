import { Component, OnInit, OnDestroy} from '@angular/core';
import { SidenavService } from '../_services/sidenav.service'
import { DatetimeService } from "../../commons/datatime.service/datetime.service";
import { ActualTimeModel } from "../../commons/datatime.service/actual-time-model";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import 'rxjs/add/operator/takeWhile';

@Component({
    selector: 'lsl-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {

    private data: ActualTimeModel;
    private display: boolean;
    private alive: boolean;
    private interval: number;
    public currentDateLong: number;
    public currentDateString: string;

    constructor(
        private datetimeService: DatetimeService,
        private sidenavService: SidenavService
    ) {
        this.display = false;
        this.alive = true;
        this.interval = 500000;
        this.currentDateLong = 0;
        this.currentDateString = "";
    }

    ngOnInit() {
        TimerObservable.create(0, this.interval)
            .takeWhile(() => this.alive)
            .subscribe(() => {
                this.datetimeService.getTime()
                    .subscribe((data) => {
                        this.data = data;
                        this.currentDateLong = this.data.currentTimeLong;
                        this.currentDateString = this.data.currentTime;
                        if (!this.display) {
                            this.display = true;
                        }
                    });
            });
    }

    ngOnDestroy() {
        this.alive = false;
    }

    toggleSidenav() {
        this.sidenavService.toggleSidenav().then(() => {
            console.log('toggle sidenav!');
        });
    }

}
