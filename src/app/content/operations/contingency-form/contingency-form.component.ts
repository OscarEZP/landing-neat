import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { StatusError } from '../../../auth/_models/statusError.model';
import { GroupTypes } from '../../../shared/_models/groupTypes';
import { Types } from '../../../shared/_models/types';
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
    public typesList = [{'groupName': null, 'types': [{ 'code': null, 'description': null}]}];
    public typeListFinal = {'CONTINGENCY_TYPE': { 'types' : [{'code':null, 'description':null}]}, 'OPERATOR': { 'types' : [{'code':null, 'description':null}]}, 'FAILURE_TYPE': { 'types' : [{'code':null, 'description':null}]}, 'INFORMER': { 'types' : [{'code':null, 'description':null}]}};
    public aircraftTempModel: Aircraft;
    public flightTempModel;
    public firstLeg;
    public timeModel: string;
    public dateModel: Date;
    public origin: string;
    public destination: string;
    public snackbarMessage: string;

    private cancelMessage: string;

    protected safety: string;
    protected contingencyType: string;

    private apiContingency = environment.apiUrl + environment.paths.contingencyList;
    private apiSafetyEvents = environment.apiUrl + environment.paths.safetyEvent;
    private apiAircrafts = environment.apiUrl + environment.paths.aircrafts;
    private apiFlights = environment.apiUrl + environment.paths.flights;
    private apiTypes = environment.apiUrl + environment.paths.types;

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
            'informer': ['Maintenance', Validators.required],
            'safety': [null, Validators.required],
            'showBarcode': [false],
            'barcode': [null],
            'safetyEventCode': [null, Validators.required],
            'contingencyType': ['CO', Validators.required],
            'failure': ['FT3', Validators.required],
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
        this.retrieveTypesConfiguration();
    }

    public submitForm(value: any) {
        const user = this.storageService.getCurrentUser();
        const initials = user.firstName.substring(0, 1).toUpperCase() + user.lastName.substring(0, 1).toUpperCase();

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
                initials
            ),
            value.contingencyType,
            initials
        );
        
        return new Promise((resolve, reject) => {

            this.http
                .post(this.apiContingency, JSON.stringify(this.contingency).replace(/_/g, ''))
                .toPromise()
                .then(rs => {
                    this.getTranslateString('OPERATIONS.CONTINGENCY_FORM.SUCCESSFULLY_MESSAGE')
                    this.messageService.openSnackBar(this.snackbarMessage);
                    this.dialogService.closeAllDialogs();
                    this.messageData.stringMessage('reload');
                    resolve();
                }, reason => {
                    const error: StatusError = reason.json();
                    this.getTranslateString('OPERATIONS.CONTINGENCY_FORM.FAILURE_MESSAGE');
                    const message: string = error.message !== null ? error.message : this.snackbarMessage;
                    this.messageService.openSnackBar(message);
                    reject(reason);
                });
        });
        
    }

    private createEpochFromTwoStrings(dt: Date, tm: string) {
        if(tm !== undefined) {
            const timeStr = tm.split(':');
            return Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate(), parseInt(timeStr[0], 10), parseInt(timeStr[1], 10), parseInt(timeStr[2], 10));
        }
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
    
    retrieveTypesConfiguration() {
        return new Promise((resolve, reject) => {
            this.http
                .get(this.apiTypes)
                .toPromise()
                .then(data => {
                    this.typesList.pop();
                    const jsonData = data.json();
                    for (let i = 0; i < jsonData.length; i++) {
                        const typeList = [];
                        for (let j = 0; j < jsonData[i].types.length; j++) {
                            const typeItem = new Types(
                                jsonData[i].types[j].code,
                                jsonData[i].types[j].description,
                                new TimeInstant(
                                    jsonData[i].types[j].updateDate.epochTime,
                                    jsonData[i].types[j].updateDate.label
                                )
                            );
                            typeList.push(typeItem);
                        }
                        const typeGroup = new GroupTypes(
                            jsonData[i].groupName,
                            typeList
                        )
                        this.typesList.push(typeGroup);
                    }
                    
                    this.separateTypes(this.typesList);
                    resolve();
                }, reason => {
                    this.messageService.openSnackBar(reason);
                    reject(reason);
                });
        });
    }
    
    private separateTypes(typeList) {
        for(let h = 0; h < typeList.length; h++) {
            let groupName = typeList[h].groupName;
            this.typeListFinal[groupName] = { 'types' : [] };
    
            for(let i = 0; i < typeList[h].types.length; i++) {
                this.typeListFinal[groupName]['types'][i] = {'code': typeList[h].types[i].code, 'description': typeList[h].types[i].description};
            }
        }
    }
    
    private getTranslateString(toTranslate: string) {
        this.translate.get(toTranslate).subscribe((res: string) => {
            this.snackbarMessage = res;
        });
    }

    openCancelDialog() {
        this.getTranslateString('OPERATIONS.CANCEL_COMPONENT.MESSAGE');
        this.messageService.openFromComponent(CancelComponent, {
            data: {message: this.snackbarMessage},
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
