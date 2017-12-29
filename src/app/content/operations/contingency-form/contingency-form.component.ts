import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import { Observable } from 'rxjs/Observable';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../../environments/environment';
import { ActualTimeModel } from '../../../shared/_models/actualTime';
import { Aircraft } from '../../../shared/_models/aircraft';
import { Contingency } from '../../../shared/_models/contingency';
import { Flight } from '../../../shared/_models/flight';
import { FlightConfiguration } from '../../../shared/_models/flightConfiguration';
import { GroupTypes } from '../../../shared/_models/groupTypes';
import { Interval } from '../../../shared/_models/interval';
import { Legs } from '../../../shared/_models/legs';
import { Safety } from '../../../shared/_models/safety';
import { Status } from '../../../shared/_models/status';
import { TimeInstant } from '../../../shared/_models/timeInstant';
import { Types } from '../../../shared/_models/types';
import { ApiRestService } from '../../../shared/_services/apiRest.service';
import { ClockService } from '../../../shared/_services/clock.service';
import { DataService } from '../../../shared/_services/data.service';
import { DatetimeService } from '../../../shared/_services/datetime.service';
import { MessageService } from '../../../shared/_services/message.service';
import { StorageService } from '../../../shared/_services/storage.service';
import { DialogService } from '../../_services/dialog.service';
import { ContingencyService } from '../_services/contingency.service';
import { CancelComponent } from '../cancel/cancel.component';

@Component({
    selector: 'lsl-contingency-form',
    templateUrl: './contingency-form.component.html',
    styleUrls: ['./contingency-form.component.scss']
})


export class ContingencyFormComponent implements OnInit, OnDestroy {
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
    public filteredAircrafts: Observable<Aircraft[]>;
    public filteredFlights: Observable<FlightConfiguration[]>;
    public flightList: FlightConfiguration[];
    public typesList = [{'groupName': null, 'types': [{'code': null, 'description': null}]}];
    public typeListFinal = {
        'CONTINGENCY_TYPE': {'types': [{'code': null, 'description': null}]},
        'FAILURE_TYPE': {'types': [{'code': null, 'description': null}]},
        'INFORMER': {'types': [{'code': null, 'description': null}]}
    };
    public aircraftTempModel: Aircraft;
    public legsArrayModel = [];
    public timeModel: string;
    public dateModel: Date;
    public snackbarMessage: string;
    public optionalIsChecked = false;
    public originDestinationModel: Legs;

    public validations = {'isSending': null};

    private apiTypes = environment.apiUrl + environment.paths.types;

    public durations: number[];

    constructor(private  dialogService: DialogService,
                private contingencyService: ContingencyService,
                private fb: FormBuilder,
                private datetimeService: DatetimeService,
                private clockService: ClockService,
                private messageData: DataService,
                private http: Http,
                private messageService: MessageService,
                public translate: TranslateService,
                private storageService: StorageService,
                private _configService: ApiRestService,
                private _apiRestService: ApiRestService) {
        this.display = true;
        this.alive = true;
        this.interval = 60000;
        this.currentUTCTime = 0;
        this.currentDateString = '';
        this.translate.setDefaultLang('en');
        this.safetyEventList = [];
        this.aircraftTempModel = new Aircraft(null, null, null);
        this.originDestinationModel = new Legs(null, null, null, null, null);
        this.aircraftList = [new Aircraft('', '', '')];

        this.contingencyForm = fb.group({
            'tail': [null, Validators.required],
            'fleet': [null, Validators.required],
            'operator': [null, Validators.required],
            'flightNumber': [null, Validators.required],
            'isBackup': [false],
            'origin': [this.originDestinationModel.origin, Validators.required],
            'destination': [this.originDestinationModel.destination, Validators.required],
            'tm': [this.timeModel, Validators.required],
            'dt': [this.dateModel, Validators.required],
            'informer': [null, Validators.required],
            'safety': [false, Validators.required],
            'showBarcode': [false],
            'barcode': [null, [Validators.pattern("^[a-zA-Z0-9]+\\S$"), Validators.maxLength(80)]],
            'safetyEventCode': [null],
            'contingencyType': [null, Validators.required],
            'failure': [null, Validators.required],
            'observation': [null, [Validators.required, Validators.maxLength(400)]],
            'reason': [null, [Validators.required, Validators.maxLength(400)]],
            'statusCode': [null, Validators.required],
            'duration': [30, Validators.required]
        });
        this.durations = [];
        this.validations = {'isSending': false};
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

        this.getSafetyEventList();
        this.getAircraftConfiguration();
        this.getFligthsList();
        this.retrieveTypesConfiguration();
        this.generateIntervalSelection();
    }

    /**
     * Unsubscribe messages when the component is destroyed
     * @return {void}
     */
    ngOnDestroy() {
        this._messageUTCSubscription.unsubscribe();
    }

    /**
     * Submit form of contingency
     * @param value
     * @return {Subscription}
     */
    public submitForm(value: any) {
        console.info(this.contingencyForm.get('safetyEventCode'));
        if (this.contingencyForm.valid) {
            this.validations.isSending = true;
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
                        this.originDestinationModel.etd.epochTime,
                        null
                    )
                ),
                value.informer,
                value.isBackup,
                value.reason,
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

            return this._apiRestService
                .add<Response>('contingencyList', this.contingency, '')
                .subscribe(() => {
                    this.getTranslateString('OPERATIONS.CONTINGENCY_FORM.SUCCESSFULLY_MESSAGE');
                    this.messageService.openSnackBar(this.snackbarMessage);
                    this.dialogService.closeAllDialogs();
                    this.messageData.stringMessage('reload');
                    this.validations.isSending = false;

                }, err => {
                    this.getTranslateString('OPERATIONS.CONTINGENCY_FORM.FAILURE_MESSAGE');
                    const message: string = err.error.message !== null ? err.error.message : this.snackbarMessage;
                    this.messageService.openSnackBar(message);
                    this.validations.isSending = false;

                });


        } else {
            this.getTranslateString('OPERATIONS.VALIDATION_ERROR_MESSAGE');
            this.messageService.openSnackBar(this.snackbarMessage);
            this.validations.isSending = false;
        }
    }

    /**
     * Generate value array for combo box of time at intervals of 5 minutes to 180.
     * @return {number[]}
     */
    private generateIntervalSelection() {
        let i: number;
        const quantity = 36;

        for (i = 0; i < quantity; i++) {
            this.durations.push(i * 5 + 5);
        }

        return this.durations;
    }

    /**
     * Get Safety Event List Configuration
     * @return {Subscription}
     */
    private getSafetyEventList() {
        return this._apiRestService
            .getAll<Safety[]>('safetyEvent')
            .subscribe(data => this.safetyEventList = data,
                error => () => {
                    this.messageService.openSnackBar(error.message);
                });
    }

    /**
     * Get aircraft configuration array
     * @return {Subscription}
     */
    private getAircraftConfiguration() {
        const searchAircraftsSignature = {
            enable: 1
        };
        this.contingencyService.getAircrafts(searchAircraftsSignature).subscribe(rs => {
            this.aircraftList = rs as Aircraft[];
            this.filteredAircrafts = this.contingencyForm.controls['tail'].valueChanges
                .startWith('')
                .map(val => this.filterAircrafts(val));
        }, err => {
            console.log(err);
        });
    }

    private filterAircrafts(val: string): Aircraft[] {
        return this.aircraftList.filter(aircraft =>
            aircraft.tail.toLocaleLowerCase().replace('-', '').search(val.toLocaleLowerCase().replace('-', '')) !== -1);
    }

    /**
     * Get Flight List Configuration
     * @return {Subscription}
     */
    private getFligthsList() {
        return this._apiRestService
            .getAll('flights')
            .subscribe(data => {
                this.flightList = data as FlightConfiguration[];
                this.filteredFlights = this.contingencyForm.controls['flightNumber'].valueChanges
                    .startWith('')
                    .map(val => this.filterFlights(val));
            }, error => {
                this.messageService.openSnackBar(error.message);
            });
    }

    private filterFlights(val: string): FlightConfiguration[] {
        return this.flightList.filter(flight =>
            flight.flightNumber.toLocaleLowerCase().search(val.toLocaleLowerCase()) !== -1);
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
                        );
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
        for (let h = 0; h < typeList.length; h++) {
            const groupName = typeList[h].groupName;
            this.typeListFinal[groupName] = {'types': []};

            for (let i = 0; i < typeList[h].types.length; i++) {
                this.typeListFinal[groupName]['types'][i] = {
                    'code': typeList[h].types[i].code,
                    'description': typeList[h].types[i].description
                };
            }
        }
    }

    private getTranslateString(toTranslate: string) {
        this.translate.get(toTranslate).subscribe((res: string) => {
            this.snackbarMessage = res;
        });
    }

    /**
     * Format date to show hour and date in UTC format, this method is only to show information because the real value
     * sended with form is the time retrieved from service of flights
     * @param {number} value
     */
    public formatDate(value: number): void {
        const date = new Date(value);
        const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);

        this.timeModel = this.addZero(utcDate.getHours()) + ':' + this.addZero(utcDate.getMinutes());
        this.dateModel = utcDate;
    }

    /**
     * Add zero to hour and minutes when the number is lower than 10
     * @param {number} time
     * @return {string}
     *
     * @example
     * this.addZero(9) will return <string> 09
     */
    private addZero(time: number): string {
        let stringHour = String(time);

        if (time < 10) {
            stringHour = '0' + time;
        }

        return stringHour;
    }

    openCancelDialog() {
        if (this.validateFilledItems()) {
            this.getTranslateString('OPERATIONS.CANCEL_COMPONENT.MESSAGE');
            this.messageService.openFromComponent(CancelComponent, {
                data: {message: this.snackbarMessage},
                horizontalPosition: 'center',
                verticalPosition: 'top'
            });
        } else {
            this.dialogService.closeAllDialogs();
        }
    }

    private validateFilledItems(): boolean {
        let counterFilled = 0;
        const defaultValid = 6;
        Object.keys(this.contingencyForm.controls).forEach(elem => {
            if (this.contingencyForm.controls[elem].valid) {
                counterFilled = counterFilled + 1;
            }
        });
        return counterFilled > defaultValid ? true : false;
    }

    public onSelectAircraft(selectedOption: string): void {

        for (const item of this.aircraftList) {
            if (item.tail === selectedOption) {
                this.aircraftTempModel = new Aircraft(item.tail, item.fleet, item.operator);
            }
        }
    }

    /**
     * Method to retrieve the legs array from flight configuration when the flight selected match
     * @param {string} selectedOption
     */
    public onSelectFlight(selectedOption: string): void {

        let flights: FlightConfiguration;
        let legs: Legs;

        for (flights of this.flightList) {
            if (flights.flightNumber === selectedOption) {
                for (legs of flights.legs) {
                    this.legsArrayModel.push(legs);
                }
            }
        }
    }

    /**
     * Method to create origin-destination model from selected flight + origin in Legs
     * @param {string} selectedOption
     */
    public onSelectOrigin(selectedOption: string): void {

        let selectedLeg: Legs;

        for (selectedLeg of this.legsArrayModel) {
            if (selectedLeg.origin === selectedOption) {
                this.originDestinationModel = new Legs(selectedLeg.origin, selectedLeg.destination, selectedLeg.etd, selectedLeg.updateDate, selectedLeg.tail);
                this.formatDate(selectedLeg.etd.epochTime);
            }
        }
    }

    /**
     * Method to change form validation depending of selecting or not one checkbox (optional until is selected)
     */
    public onSelectOptional() {
        if (!this.optionalIsChecked) {
            this.contingencyForm.get('safetyEventCode').setValidators(Validators.required);
            this.contingencyForm.get('safetyEventCode').updateValueAndValidity();
        } else {
            this.contingencyForm.get('safetyEventCode').setValue(null);
            this.contingencyForm.get('safetyEventCode').clearValidators();
            this.contingencyForm.get('safetyEventCode').updateValueAndValidity();
        }
    }

    onCloseCreationContingencyForm(): void {
        this.dialogService.closeAllDialogs();
    }

    newMessage() {
        this.messageData.changeTimeUTCMessage(this.currentUTCTime);
    }

    public validateAircraft(value: string): Boolean {
        let match = false;

        for (const item of this.aircraftList) {
            if (item.tail === value) {
                match = true;
            }
        }
        return match;
    }
}
