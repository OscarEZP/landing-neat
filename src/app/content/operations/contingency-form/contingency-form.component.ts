import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { DialogService} from '../../_services/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../../../environments/environment';
import { ActualTimeModel } from '../../../shared/_models/actual-time-model';
import { Aircraft } from '../../../shared/_models/aircraft';
import { Contingency } from '../../../shared/_models/contingency';
import { Flight } from '../../../shared/_models/flight';
import { FlightConfiguration } from '../../../shared/_models/flightConfiguration';
import { Interval } from '../../../shared/_models/interval';
import { Legs } from '../../../shared/_models/legs';
import { Safety } from '../../../shared/_models/safety';
import { Status } from '../../../shared/_models/status';
import { TimeInstant } from '../../../shared/_models/timeInstant';
import { ClockService } from '../../../shared/_services/clock.service';
import { DataService } from '../../../shared/_services/data.service';
import { DatetimeService } from '../../../shared/_services/datetime.service';
import { MessageService } from '../../../shared/_services/message.service';
import { StorageService } from '../../../shared/_services/storage.service';
import { ContingencyService } from '../_services/contingency.service';
import { CancelComponent } from '../cancel/cancel.component';

@Component({
    selector: 'lsl-contingency-form',
    templateUrl: './contingency-form.component.html',
    styleUrls: ['./contingency-form.component.scss']
})

export class ContingencyFormComponent implements OnInit {
    private _messageUTCSubscription: Subscription;
    private alive: boolean;
    private data: ActualTimeModel;
    private interval: number;
    public contingencyForm: FormGroup;
    public currentUTCTime: number;
    public currentDateString: string;
    public display: boolean;
    public time: Date;
    public contingency: Contingency;
    public safetyEventList: Safety[];
    public aircraftList: Aircraft[];
    public flightList = [{'flightNumber': null, 'etd': null, 'legs': null}];
    public aircraftTempModel: Aircraft;
    public flightTempModel;
    public firstLeg;
    public timeModel: string;
    public dateModel: Date;
    public origin: string;
    public destination: string;

    private cancelMessage: string;

    protected safety: string;
    protected contingencyType: string;

    private apiContingency = environment.apiUrl + environment.paths.contingencyList;
    private apiSafetyEvents = environment.apiUrl + environment.paths.safetyEvent;
    private apiAircrafts = environment.apiUrl + environment.paths.aircrafts;
    private apiFlights = environment.apiUrl + environment.paths.flights;

    constructor(private  dialogService: DialogService,
                private contingencyService: ContingencyService,
                private fb: FormBuilder,
                private datetimeService: DatetimeService,
                private clockService: ClockService,
                private messageData: DataService,
                private http: Http,
                private messageService: MessageService,
                public translate: TranslateService,
                private storageService: StorageService) {
        this.flightTempModel = [];
        this.firstLeg = {};
        this.display = true;
        this.alive = true;
        this.interval = 60000;
        this.currentUTCTime = 0;
        this.currentDateString = '';
        this.cancelMessage = '';
        this.translate.setDefaultLang('en');
        this.safetyEventList = [];
        this.aircraftList = [];
        this.aircraftTempModel = new Aircraft(null, null, null);

        this.contingencyForm = fb.group({
            'tail': [null, Validators.required],
            'fleet': [null, Validators.required],
            'operator': [null, Validators.required],
            'flightNumber': [null, Validators.required],
            'isBackup': [false],
            'origin': [false],
            'destination': [false],
            'tm': [null, Validators.required],
            'dt': [null, Validators.required],
            'informer': ['cco', Validators.required],
            'barcode': [false],
            'safety': [null, Validators.required],
            'safetyEventCode': [null, Validators.required],
            'contingencyType': ['operation', Validators.required],
            'failure': ['technical', Validators.required],
            'observation': [null, Validators.required],
            'statusCode': ['NI1', Validators.required],
            'duration': [null]
        });
    }

    ngOnInit() {
        this._messageUTCSubscription = this.messageData.currentNumberMessage.subscribe(message => this.currentUTCTime = message);

        TimerObservable.create(0, this.interval)
            .takeWhile(() => this.alive)
            .subscribe(() => {
                this.datetimeService.getTime()
                    .subscribe((data) => {
                        this.data = data;
                        this.currentUTCTime = this.data.currentTimeLong;
                        this.currentDateString = this.data.currentTime;
                        this.newMessage();
                        this.clockService.setClock(this.currentUTCTime);
                        if (!this.display) {
                            this.display = true;
                        }
                    });
            });

        this.clockService.getClock().subscribe(time => this.time = time);

        this.retrieveSafetyEventsConfiguration();
        this.retrieveAircraftsConfiguration();
        this.retrieveFlightsConfiguration();
        this.translateMessageCancel();
    }

    public submitForm(value: any) {
        const user = this.storageService.getCurrentUser();

        this.contingency = new Contingency(
            null,
            new Aircraft(
                value.tail,
                value.fleet,
                value.operator
            ),
            value.barcode,
            null,
            value.failure,
            new Flight(
                value.flightNumber,
                value.origin,
                value.destination,
                new TimeInstant(
                    this.createEpochFromTwoStrings(this.dateModel, this.timeModel),
                    null
                )
            ),
            value.informer,
            value.isBackup,
            'fake reason, we need to implement in front',
            new Safety(
                value.safetyEventCode,
                null
            ),
            new Status(
                value.statusCode,
                null,
                null,
                value.observation,
                null,
                new Interval(
                    new TimeInstant(
                        null,
                        null
                    ),
                    value.duration
                ),
                user.userId
            ),
            'type',
            user.userId
        );

        return new Promise((resolve, reject) => {

            this.http
                .post(this.apiContingency, JSON.stringify(this.contingency).replace(/_/g, ''))
                .toPromise()
                .then(rs => {
                    this.messageService.openSnackBar(rs.json());
                    this.dialogService.closeAllDialogs()
                    this.messageData.stringMessage('reload');
                    resolve();
                }, reason => {
                    this.messageService.openSnackBar(reason);
                    reject(reason);
                });
        });
    }

    private createEpochFromTwoStrings(dt: Date, tm: string) {
        const timeStr = tm.split(':');
        return Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate(), parseInt(timeStr[0], 10), parseInt(timeStr[1], 10), parseInt(timeStr[2], 10));
    }

    private retrieveSafetyEventsConfiguration() {
        return new Promise((resolve, reject) => {
            this.http
                .get(this.apiSafetyEvents)
                .toPromise()
                .then(data => {
                    const jsonData = data.json();
                    for (let i = 0; i < jsonData.length; i++) {
                        this.safetyEventList[i] = new Safety(jsonData[i].code, jsonData[i].description);
                    }
                    resolve();
                }, reason => {
                    this.messageService.openSnackBar(reason);
                    reject(reason);
                });
        });
    }

    private retrieveAircraftsConfiguration() {
        return new Promise((resolve, reject) => {
            this.http
                .get(this.apiAircrafts)
                .toPromise()
                .then(data => {
                    const jsonData = data.json();
                    for (let i = 0; i < jsonData.length; i++) {
                        this.aircraftList[i] = new Aircraft(jsonData[i].tail, jsonData[i].fleet, jsonData[i].operator);
                    }
                    resolve();
                }, reason => {
                    this.messageService.openSnackBar(reason);
                    reject(reason);
                });
        });
    }

    private retrieveFlightsConfiguration() {
        return new Promise((resolve, reject) => {
            this.http
                .get(this.apiFlights)
                .toPromise()
                .then(data => {
                    this.flightList.pop();
                    const jsonData = data.json();
                    for (let i = 0; i < jsonData.length; i++) {
                        const legList = [];
                        for (let j = 0; j < jsonData[i].legs.length; j++) {
                            const legItem = new Legs(
                                jsonData[i].legs[j].origin,
                                jsonData[i].legs[j].destination,
                                new TimeInstant(
                                    jsonData[i].legs[j].updateDate.epochTime,
                                    jsonData[i].legs[j].updateDate.label
                                )
                            );
                            legList.push(legItem);
                        }

                        const flightConfig = new FlightConfiguration(
                            jsonData[i].flightNumber,
                            legList,
                            new TimeInstant(jsonData[i].etd.epochTime, jsonData[i].etd.label));
                        this.flightList.push(flightConfig);
                    }
                    resolve();
                }, reason => {
                    this.messageService.openSnackBar(reason);
                    reject(reason);
                });
        });
    }

    translateMessageCancel() {
        this.translate.get('OPERATIONS.CANCEL_COMPONENT.MESSAGE').subscribe((res: string) => {
            this.cancelMessage = res;
        });
    }

    openCancelDialog() {
        this.messageService.openFromComponent(CancelComponent, {
            data: {message: this.cancelMessage},
            horizontalPosition: 'center',
            verticalPosition: 'top'
        });
    }

    public onSelectAircraft(selectedOption: string): void {

        for (const item of this.aircraftList) {
            if (item.tail === selectedOption) {
                this.aircraftTempModel = new Aircraft(item.tail, item.fleet, item.operator);
            }
        }
    }

    public onSelectFlight(selectedOption: string): void {

        for (const item of this.flightList) {
            if (item.flightNumber === selectedOption) {
                const newDate = new Date(item.etd.label);
                this.timeModel = newDate.getHours() + ':' + newDate.getMinutes() + ':' + newDate.getSeconds();
                this.dateModel = newDate;
                this.flightTempModel = item.legs;
            }
        }
        this.firstLeg.origin = this.flightTempModel[0].origin;
        this.firstLeg.destination = this.flightTempModel[0].destination;
    }

    onCloseCreationContingencyForm(): void {
        this.dialogService.closeAllDialogs();
    }

    newMessage() {
        this.messageData.changeTimeUTCMessage(this.currentUTCTime);
    }

    onSelectOrigin(selected: string): void {
        this.firstLeg.destination = this.flightTempModel.filter(leg => leg.origin === selected)[0].destination;
    }

    onSelectDestination(selected: string): void {
        this.firstLeg.origin = this.flightTempModel.filter(leg => leg.destination === selected)[0].origin;
    }
}
