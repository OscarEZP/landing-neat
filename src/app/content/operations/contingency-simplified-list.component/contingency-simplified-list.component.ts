import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { Subscription } from 'rxjs/Subscription';
import { Aircraft } from '../../../shared/_models/aircraft';
import { Contingency } from '../../../shared/_models/contingency';
import { Flight } from '../../../shared/_models/flight';
import { Interval } from '../../../shared/_models/interval';
import { Safety } from '../../../shared/_models/safety';
import { Status } from '../../../shared/_models/status';
import { TimeInstant } from '../../../shared/_models/timeInstant';
import { ApiRestService } from '../../../shared/_services/apiRest.service';
import { DataService } from '../../../shared/_services/data.service';
import { MessageService } from '../../../shared/_services/message.service';
import { DialogService } from '../../_services/dialog.service';

@Component({
    selector: 'lsl-contingency-simplified-list',
    templateUrl: './contingency-simplified-list.component.html',
    styleUrls: ['./contingency-simplified-list.component.scss'],
    providers: [DialogService]
})

export class ContingencySimplifiedListComponent implements OnInit, OnDestroy {

    private _messageSubscriptions: Subscription;
    private _reloadSubscription: Subscription;
    private _alive: boolean;
    public contingencyList;
    public progressBarColor: string;
    public currentUTCTime: number;

    @Output() messageEvent = new EventEmitter<number>();

    constructor(private httpClient: HttpClient, private messageData: DataService, private dialogService: DialogService, public translate: TranslateService, private messageService: MessageService, private _apiService: ApiRestService) {
        translate.setDefaultLang('en');
        this.contingencyList = [];
        this._alive = true;
    }

    ngOnInit() {
        this.currentUTCTime = 0;
        this.progressBarColor = 'primary';
        this._messageSubscriptions = this.messageData.currentNumberMessage.subscribe(message => this.currentUTCTime = message);
        this._reloadSubscription = this.messageData.currentStringMessage.subscribe(message => this.reloadList(message));
        this.getContingences();

        IntervalObservable.create(60000)
            .takeWhile(() => this._alive)
            .subscribe(() => {
                this.reloadList('reload');
            });

    }

    ngOnDestroy() {
        this._messageSubscriptions.unsubscribe();
        this._reloadSubscription.unsubscribe();
    }

    public reloadList(message) {
        if (message === 'reload') {
            this.getContingences();
        }
    }

    private getContingences() {
        this.messageData.stringMessage('open');

        let response;

        this._apiService
            .getAll<any[]>('contingencyList')
            .subscribe((data: any[]) => response = data,
                error => () => {
                    this.messageData.stringMessage('close');
                    this.messageService.openSnackBar(error);
                },
                () => {
                    this.messageData.stringMessage('close');
                    this.applyRs(response);
                    this.messageEvent.emit(response.length);
                });
    }

    private applyRs(data: any[]) {

        for (let i = 0; i < data.length; i++) {

            this.contingencyList[i] = new Contingency(
                data[i].id,
                new Aircraft(
                    data[i].aircraft.tail,
                    data[i].aircraft.fleet,
                    data[i].aircraft.operator
                ),
                data[i].barcode,
                new TimeInstant(
                    data[i].creationDate.epochTime,
                    data[i].creationDate.label
                ),
                data[i].failure,
                new Flight(
                    data[i].flight.flightNumber,
                    data[i].flight.origin,
                    data[i].flight.destination,
                    new TimeInstant(
                        data[i].flight.etd.epochTime,
                        data[i].flight.etd.label
                    )
                ),
                data[i].informer,
                data[i].isBackup,
                data[i].reason,
                new Safety(
                    data[i].safetyEvent.code,
                    data[i].safetyEvent.description
                ),
                new Status(
                    data[i].status.code,
                    data[i].status.contingencyId,
                    new TimeInstant(
                        data[i].status.creationDate.epochTime,
                        data[i].status.creationDate.label
                    ),
                    data[i].status.observation,
                    new Interval(
                        new TimeInstant(
                            data[i].status.realInterval.dt.epochTime,
                            data[i].status.realInterval.dt.label
                        ),
                        data[i].status.realInterval.duration
                    ),
                    new Interval(
                        new TimeInstant(
                            data[i].status.requestedInterval.dt.epochTime,
                            data[i].status.requestedInterval.dt.label
                        ),
                        data[i].status.requestedInterval.duration
                    ),
                    data[i].status.username
                ),
                data[i].type,
                data[i].username
            );
        }
    }

    public getTimeAverage(creationDate: any, duration: any, remain: boolean, limit: number) {
        const actualTime = this.currentUTCTime;
        let average: number;
        const valueNumber = creationDate - actualTime;
        let warning = false;

        if (valueNumber > 0) {
            if (valueNumber <= limit) {
                warning = true;
            }
            const minutesConsumed = duration - ((valueNumber / 1000) / 60);

            average = Math.round((minutesConsumed * 100) / duration);
        } else {
            warning = true;
            average = 100;
        }

        return remain ? warning : average;
    }

}
