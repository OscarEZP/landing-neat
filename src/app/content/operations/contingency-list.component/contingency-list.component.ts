import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Http, Response } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../../../environments/environment';
import { Aircraft } from '../../../shared/_models/aircraft';
import { Contingency } from '../../../shared/_models/contingency';
import { DateModel } from '../../../shared/_models/dateModel';
import { Flight } from '../../../shared/_models/flight';
import { Interval } from '../../../shared/_models/interval';
import { Safety } from '../../../shared/_models/safety';
import { Status } from '../../../shared/_models/status';
import { DataService } from '../../../shared/_services/data.service';
import { DialogService } from '../../_services/dialog.service';
import { ContingencyFormComponent } from '../contingency-form/contingency-form.component';

@Component({
    selector: 'lsl-contingency-list',
    templateUrl: './contingency-list.component.html',
    styleUrls: ['./contingency-list.component.scss'],
    providers: [DialogService]
})

export class ContingencyListComponent implements OnInit, OnDestroy {

    // public contingencyList: any = {};
    private _messageSubscriptions: Subscription;
    private apiUrl = environment.apiUrl + environment.paths.contingencyList;
    private errorMessage: string;
    public contingencyList: Contingency;
    public progressBarColor: string;
    public utcTime: number;

    @Output() messageEvent = new EventEmitter<number>();

    constructor(private http: Http, private messageData: DataService, private dialogService: DialogService, translate: TranslateService) {
        translate.setDefaultLang('en');
    }

    ngOnInit() {
        this.getContingences();
        this.getData();
        this.utcTime = 0;
        this.progressBarColor = 'primary';
        this._messageSubscriptions = this.messageData.currentNumberMessage.subscribe(message => this.utcTime = message);
    }

    ngOnDestroy() {
        this._messageSubscriptions.unsubscribe();
    }

    public openDialog() {
        this.dialogService.openDialog(ContingencyFormComponent);
    }

    getData() {
        this.messageData.activateLoadingBar('open');

        return this.http
            .get(this.apiUrl)
            .map((res: Response) => res.json());
    }

    getContingences() {
        this.getData().subscribe(data => {
            // this.contingencyList = data;
            this.contingencyList = new Contingency(
                new Aircraft(
                    data.aircraft.tail,
                    data.aircraft.fleet,
                    data.fleet.operator),
                data.barcode,
                data.etd,
                data.failure,
                new Flight(
                    data.flight.flightNumber,
                    data.flight.origin,
                    data.flight.operator),
                data.informer,
                data.isBackup,
                data.reason,
                new Safety(
                    data.safetyEvent.code
                ),
                new Status(
                    data.status.code,
                    data.status.observation,
                    new Interval(
                        data.status.requestedInterval.duration,
                        new DateModel(
                            data.status.requestedInterval.date.epochTime
                        )
                    ),
                    data.status.userName
                ),
                data.type
            );
            this.messageEvent.emit(data.length);
            this.messageData.activateLoadingBar('close');
        }, error => {
            this.errorMessage = error;
            this.messageData.activateLoadingBar('close');
        });
    }

    getTimeAverage(creationDate: any, duration: any, remain: boolean, limit: number) {
        const actualTime = this.utcTime;
        let average: number;
        const valueNumber = (creationDate + duration) - actualTime;
        let warning = false;

        if (valueNumber > 0) {
            if (valueNumber <= limit) {
                warning = true;
            }
            average = 100 - Math.round(((valueNumber * 100) / duration));
        } else {
            warning = true;
            average = 100;
        }

        return remain ? warning : average;
    }
}
