import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/startWith';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {TimerObservable} from 'rxjs/observable/TimerObservable';
import {map, startWith} from 'rxjs/operators';
import {Subscription} from 'rxjs/Subscription';
import {Aircraft} from '../../../shared/_models/aircraft';
import {AircraftSearch} from '../../../shared/_models/configuration/aircraftSearch';
import {DateModel} from '../../../shared/_models/configuration/dateModel';
import {FlightSearch} from '../../../shared/_models/configuration/flightSearch';
import {GroupTypes} from '../../../shared/_models/configuration/groupTypes';
import {Location} from '../../../shared/_models/configuration/location';
import {StatusCode} from '../../../shared/_models/configuration/statusCode';
import {Types} from '../../../shared/_models/configuration/types';
import {Contingency} from '../../../shared/_models/contingency/contingency';
import {Flight} from '../../../shared/_models/flight';
import {Safety} from '../../../shared/_models/safety';
import {Status} from '../../../shared/_models/status';
import {TimeInstant} from '../../../shared/_models/timeInstant';
import {Validation} from '../../../shared/_models/validation';
import {ApiRestService} from '../../../shared/_services/apiRest.service';
import {ClockService} from '../../../shared/_services/clock.service';
import {DataService} from '../../../shared/_services/data.service';
import {DatetimeService} from '../../../shared/_services/datetime.service';
import {MessageService} from '../../../shared/_services/message.service';
import {StorageService} from '../../../shared/_services/storage.service';
import {DateUtil} from '../../../shared/util/dateUtil';
import {DialogService} from '../../_services/dialog.service';
import {CancelComponent} from '../cancel/cancel.component';

@Component({
    selector: 'lsl-contingency-form',
    templateUrl: './create-contingency.component.html',
    styleUrls: ['./create-contingency.component.scss']
})

export class ContingencyFormComponent implements OnInit, OnDestroy {
    private _messageUTCSubscription: Subscription;
    private _aircraftList: Aircraft[];
    private _flightList: Flight[];
    private _statusCodes: StatusCode[];
    private _safetyEventList: Safety[];
    private _groupTypeList: GroupTypes[];
    private _contingencyType: Types[];
    private _operatorList: Types[];
    private _failureType: Types[];
    private _informer: Types[];
    private _contingencyForm: FormGroup;
    private _contingency: Contingency;
    private _stations: Location[];

    private _durationArray: number[];
    private _contingencyDateModel: DateModel[];
    private _utcModel: TimeInstant;

    private _alive: boolean;
    private _interval: number;
    private _snackbarMessage: string;

    private _isSafetyEvent: boolean;
    private _timeClock: Date;

    private _validations: Validation;

    private _observableFlightList: Observable<Flight[]>;
    private _observableAircraftList: Observable<Aircraft[]>;
    private _observableLocationList: Observable<Location[]>;
    private _observableOperatorList: Observable<Types[]>;

    private _aircraftSubscription: Subscription;
    private _safetyEventSubscription: Subscription;

    constructor(private _dialogService: DialogService,
                private _fb: FormBuilder,
                private _datetimeService: DatetimeService,
                private _clockService: ClockService,
                private _messageData: DataService,
                private _messageService: MessageService,
                private _storageService: StorageService,
                private _apiRestService: ApiRestService,
                private _translate: TranslateService) {

        const initFakeDate = new Date().getTime();

        this.alive = true;
        this.interval = 1000 * 60;
        this.isSafetyEvent = false;
        this.utcModel = new TimeInstant(initFakeDate, null);
        this.durationArray = [];

        const flight: Flight = Flight.getInstance();
        flight.etd.epochTime = initFakeDate;

        const status: Status = Status.getInstance();
        status.creationDate.epochTime = initFakeDate;
        status.username = this._storageService.getCurrentUser().username;
        status.requestedInterval.duration = 30;

        this.contingency = Contingency.getInstance();
        this.contingency.username = this._storageService.getCurrentUser().username;
        this.contingency.status = status;
        this.contingency.flight = flight;
        this.contingencyType = [];
        this.operatorList = [];
        this.failureType = [];
        this.informer = [];

        this.stations = [new Location(null, null, null)];

        this.contingencyDateModel = [
            new DateModel(null),
            new DateModel(null),
            new DateModel(null),
            new DateModel(null)
        ];

        this.aircraftList = [];

        this._contingencyForm = _fb.group({
            'tail': [this.contingency.aircraft.tail, Validators.required, this.tailDomainValidator.bind(this)],
            'fleet': [this.contingency.aircraft.fleet, Validators.required],
            'operator': [this.contingency.aircraft.operator, Validators.required, this.operatorDomainValidator.bind(this)],
            'isBackup': [false, this.contingency.isBackup],
            'station': [this.contingency.backup.location],
            'slotTm': [this.contingencyDateModel[1].timeString],
            'slotDate': [this.contingencyDateModel[1].dateString],
            'flightNumber': [this.contingency.flight.flightNumber, Validators.required],
            'origin': [this.contingency.flight.origin, Validators.required],
            'destination': [this.contingency.flight.destination, Validators.required],
            'tm': [this.contingencyDateModel[0].timeString, Validators.required],
            'dt': [this.contingencyDateModel[0].dateString, Validators.required],
            'informer': [this.contingency.informer, Validators.required],
            'safety': [false, Validators.required],
            'showBarcode': [false],
            'barcode': [this.contingency.barcode, [Validators.pattern('^[a-zA-Z0-9]+\\S$'), Validators.maxLength(80)]],
            'safetyEventCode': [this.contingency.safetyEvent.code],
            'contingencyType': [this.contingency.type, Validators.required],
            'failure': [this.contingency.failure, Validators.required],
            'observation': [this.contingency.status.observation, [Validators.required, Validators.maxLength(400)]],
            'reason': [this.contingency.reason, [Validators.required, Validators.maxLength(400)]],
            'statusCode': [this.contingency.status.code, Validators.required],
            'duration': [this.contingency.status.requestedInterval.duration, Validators.required]
        });

        this.validations = new Validation(false, true, true, false);
    }


    public ngOnInit() {
        this._messageUTCSubscription = this._messageData.currentNumberMessage.subscribe(message => this.utcModel.epochTime = message);
        TimerObservable.create(0, this.interval)
            .takeWhile(() => this.alive)
            .subscribe(() => {
                this._datetimeService.getTime()
                    .subscribe((data) => {
                        this.utcModel = new TimeInstant(data.currentTimeLong, data.currentTime);
                        this.newMessage();
                        this.initDateModels(this.utcModel.epochTime);
                        this._clockService.setClock(this.utcModel.epochTime);
                    });
            });

        this._clockService.getClock().subscribe(time => this.timeClock = time);
        this._aircraftSubscription = this.getAircraftList();
        this._safetyEventSubscription = this.getSafetyEventList();
        this.getGroupTypes();
        this.getLocationsList();
        this.getOperatorList();
        this.getMaxStatusCodes();
        this.generateIntervalSelection();
    }

    /**
     * Method to init date model for contingency creation, there will be 4 values:
     * 1) Flight Contingency date model
     * 2) Backup date model
     * 3) Minimum date model
     * 4) Maximum date model
     * @return {DateModel[]}
     */
    private initDateModels(epochDate: number): DateModel[] {
        return this.contingencyDateModel = [
            this.contingencyDateModel[0] !== null ? this.contingencyDateModel[0] : new DateModel(null),
            this.contingencyDateModel[1] !== null ? this.contingencyDateModel[1] : new DateModel(null),
            new DateModel(epochDate, -24),
            new DateModel(epochDate, 24)
        ];
    }

    /**
     * Unsubscribe messages when the component is destroyed
     * @return {void}
     */
    public ngOnDestroy() {
        this._messageUTCSubscription.unsubscribe();
        this._aircraftSubscription.unsubscribe();
        this._safetyEventSubscription.unsubscribe();
    }

    /**
     * Submit form of contingency
     * @param value
     * @return {Subscription}
     */
    public submitForm(value: any) {

        if (this.contingencyForm.valid) {

            this.isBackupCheck();

            this.validations.isSending = true;

            let res: Response;
            this._apiRestService
                .add<Response>('contingencyList', this.contingency)
                .subscribe(response => res = response,
                    err => {

                        this.getTranslateString('OPERATIONS.CONTINGENCY_FORM.FAILURE_MESSAGE');
                        const message: string = (err.error != null && err.error.message != null) ? err.error.message : this.snackbarMessage;
                        this._messageService.openSnackBar(message);
                        this.validations.isSending = false;
                    }, () => {
                        this.getTranslateString('OPERATIONS.CONTINGENCY_FORM.SUCCESSFULLY_MESSAGE');
                        this._messageService.openSnackBar(this.snackbarMessage);
                        this._dialogService.closeAllDialogs();
                        this._messageData.stringMessage('reload');
                        this.validations.isSending = false;
                    });
        } else {
            this.getTranslateString('OPERATIONS.VALIDATION_ERROR_MESSAGE');
            this._messageService.openSnackBar(this.snackbarMessage);
            this.validations.isSending = false;
        }
    }

    /**
     * Method to take values from slot time, slot date and set value of slot date in contingency model
     */
    private isBackupCheck(): void {
        if (this.contingency.isBackup) {
            this.contingency.backup.slot.epochTime = DateUtil.createEpochFromTwoStrings(this.contingencyDateModel[1].dateObj, this.contingencyDateModel[1].timeString);
        }
    }

    /**
     * Generate value array for combo box of time at intervals of 5 minutes to 180.
     * @return {number[]}
     */
    private generateIntervalSelection(): number[] {
        let i: number;
        const quantity = 36;

        for (i = 0; i < quantity; i++) {
            this.durationArray.push(i * 5 + 5);
        }

        return this.durationArray;
    }

    /**
     * Get operator list configuration
     * @return {Subscription}
     */
    private getOperatorList(): Subscription {
        return this._apiRestService
            .getAll<Types[]>('operator')
            .subscribe(response => {
                this.operatorList = response;

                this.observableOperatorList = this.contingencyForm
                    .controls['operator']
                    .valueChanges
                    .pipe(
                        startWith(''),
                        map(val => this.operatorFilter(val))
                    );
            });
    }

    /**
     * Get Safety Event List Configuration
     * @return {Subscription}
     */

    private getSafetyEventList(): Subscription {
        return this._apiRestService
            .getAll<Safety[]>('safetyEvent')
            .subscribe(data => this.safetyEventList = data,
                error => () => {
                    this._messageService.openSnackBar(error.message);
                });
    }

    /**
     * Get aircraft list and create an observable list of fligths will be consumed in the view
     * @return {Subscription}
     */

    private getAircraftList(): Subscription {
        return this._apiRestService
            .search<Aircraft[]>('aircraftsSearch', new AircraftSearch(1))
            .subscribe((response: Aircraft[]) => {
                this.aircraftList = response;
                this.observableAircraftList = this.contingencyForm
                    .controls['tail']
                    .valueChanges
                    .pipe(
                        startWith(''),
                        map(val => this.aircraftFilter(val))
                    );
            });
    }

    /**
     * Get all group types
     * @return {Subscription}
     */
    private getGroupTypes(): Subscription {

        return this._apiRestService
            .getAll<GroupTypes[]>('types')
            .subscribe((response: GroupTypes[]) => {
                this.groupTypeList = response;
                this.getSelectedGroupType();
            });
    }

    /**
     * Split the groups accord to they purpose and init they instances variables
     */
    private getSelectedGroupType(): void {
        let variableName: string;
        this.groupTypeList.forEach(function (value) {
            variableName = value.groupName.toLowerCase().replace(/(\_\w)/g, function (m) {
                return m[1].toUpperCase();
            });
            this[variableName] = value.types;

        }, this);
    }

    /**
     * Get the location list from server
     * @return {Subscription}
     */
    private getLocationsList(): Subscription {
        return this._apiRestService
            .getAll<Location[]>('locations')
            .subscribe((response: Location[]) => {
                this.stations = response;

                this.observableLocationList = this.contingencyForm
                    .controls['station']
                    .valueChanges
                    .pipe(
                        startWith(''),
                        map(val => this.locationFilter(val))
                    );
            });
    }

    /**
     * Call the config to get min and max status codes availables
     * @return {Subscription}
     */
    private getMaxStatusCodes(): Subscription {
        return this._apiRestService
            .getSingle<StatusCode[]>('configStatus', null)
            .subscribe((response: StatusCode[]) => {
                this.statusCodes = response;
            });
    }

    /**
     * Method to set level of status selected (between NI1 and ETR)
     * @param {number} statusLevel
     */
    public statusSelection(statusLevel: number): void {
        this.contingency.status.level = statusLevel;
    }

    private getTranslateString(toTranslate: string) {
        this._translate.get(toTranslate).subscribe((res: string) => {
            this.snackbarMessage = res;
        });
    }

    public openCancelDialog(): void {
        if (this.validateFilledItems()) {
            this.getTranslateString('OPERATIONS.CANCEL_COMPONENT.MESSAGE');
            this._messageService.openFromComponent(CancelComponent, {
                data: {message: this.snackbarMessage},
                horizontalPosition: 'center',
                verticalPosition: 'top'
            });
        } else {
            this._dialogService.closeAllDialogs();
        }
    }

    /**
     *
     * @return {boolean}
     */
    private validateFilledItems(): boolean {
        let counterPristine = 0;
        let counterItems = 0;
        Object.keys(this.contingencyForm.controls).forEach(elem => {
            counterItems += 1;
            if (this.contingencyForm.controls[elem].pristine) {
                counterPristine += 1;
            }
        });

        return counterPristine < counterItems;
    }

    /**
     * Method triggered when aircraft tail is selected, populate the fields and the model in contingency aircraft & flight
     * Also force selection of first flight in the form and recalculate the flight etd
     * @param {string} selectedOption
     */
    public onSelectAircraft(selectedOption: string): void {

        const flightSearch = new FlightSearch(selectedOption, 0, 5, new TimeInstant(this.utcModel.epochTime, null));
        this.flightList = [null];

        this._apiRestService
            .search<Flight[]>('flights', flightSearch)
            .subscribe((response: Flight[]) => {
                this.flightList = response;

                for (const item of this.aircraftList) {
                    if (item.tail === selectedOption) {
                        this.contingency.aircraft = new Aircraft(item.tail, item.fleet, item.operator);
                        if (this.flightList.length > 0) {
                            this.contingency.flight = new Flight(
                                this.flightList[0].flightNumber,
                                this.flightList[0].origin,
                                this.flightList[0].destination,
                                new TimeInstant(
                                    this.flightList[0].etd.epochTime,
                                    this.flightList[0].etd.label
                                ));
                        } else {
                            this.contingency.flight = Flight.getInstance();
                        }

                        this.contingencyDateModel[0].updateFromEpoch(this.contingency.flight.etd.epochTime);

                        this.contingencyForm.get('operator').setValue(this.contingency.aircraft.operator);
                        this.contingencyForm.get('operator').updateValueAndValidity();
                        this.contingencyForm.get('flightNumber').setValue(this.contingency.flight.flightNumber);
                        this.contingencyForm.get('flightNumber').updateValueAndValidity();
                    }
                }

                this.observableFlightList = this.contingencyForm
                    .controls['flightNumber']
                    .valueChanges
                    .pipe(
                        startWith(''),
                        map(val => this.flightFilter(val))
                    );
            });
    }

    /**
     * Method triggered when a flight is selected and populate selected values in the contingency.flight model
     * @param {Event} event
     * @param {Flight} fl
     */
    public onSelectFlight(event: Event, fl: Flight): void {
        this.contingency.flight.flightNumber = fl.flightNumber;
        this.contingency.flight.origin = fl.origin;
        this.contingency.flight.destination = fl.destination;
        this.contingency.flight.etd.epochTime = fl.etd.epochTime;
        this.contingency.flight.etd.label = fl.etd.label;
        this.contingencyDateModel[0].updateFromEpoch(fl.etd.epochTime);
    }

    /**
     * Method to change form validation depending of selecting or not one checkbox (optional until is selected)
     */
    public onSelectOptional(checkboxName: string, itemsToValidate: string[], itemsToCleanValidaton: string[] = []) {
        itemsToValidate.forEach(item => {
            this.contingencyForm.get(item).setValue(null);
            if (!this.contingencyForm.get(checkboxName).value) {
                this.contingencyForm.get(item).setValidators(Validators.required);
            } else {
                this.contingencyForm.get(item).clearValidators();
            }
            this.contingencyForm.get(item).updateValueAndValidity();
        });

        itemsToCleanValidaton.forEach(item => {
            if (!this.contingencyForm.get(checkboxName).value) {
                this.contingencyForm.get(item).clearValidators();
            } else {
                this.contingencyForm.get(item).setValidators(Validators.required);
            }
            this.contingencyForm.get(item).updateValueAndValidity();
        });
    }

    private onCloseCreationContingencyForm(): void {
        this._dialogService.closeAllDialogs();
    }

    private newMessage(): void {
        this._messageData.changeTimeUTCMessage(this.utcModel.epochTime);
    }

    /**
     * Custom validation for Aircraft Tail
     * @param {FormControl} control
     * @return {Observable<any>}
     */
    public tailDomainValidator(control: FormControl): Observable<any> {
        const tail = control.value;

        return Observable.of(this.aircraftList).map(res => {
            for (const item of res) {
                if (item.tail === tail) {
                    return null;
                }
            }

            return {
                tailDomain: true
            };
        });
    }

    /**
     * Custom validation for Operator
     * @param {FormControl} control
     * @return {Observable<any>}
     */
    public operatorDomainValidator(control: FormControl) {
        const operator = control.value;


        return Observable.of(this.operatorList).map(res => {
            for (const item of res) {
                if (operator === item.code) {
                    return null;
                }
            }

            return {
                operatorDomain: true
            };
        });
    }

    /**
     * Filter for aircraft observable list in view
     * @param {string} val
     * @return {Aircraft[]}
     */
    private aircraftFilter(val: string): Aircraft[] {
        return this.aircraftList.filter(aircraft =>
            aircraft.tail.toLocaleLowerCase().search(val.toLocaleLowerCase()) !== -1);
    }

    /**
     * Filter for flights observable list in view
     * @param {string} val
     * @return {Flight[]}
     */
    private flightFilter(val: string): Flight[] {
        return this.flightList.filter(flight =>
            flight.flightNumber.toLocaleLowerCase().search(val.toLocaleLowerCase()) !== -1);
    }

    /**
     * Filter for location observable list in view
     * @param {string} val
     * @return {Location[]}
     */
    private locationFilter(val: string): Location[] {
        if (val !== null) {
            return this.stations.filter(location =>
                location.code.toLocaleLowerCase().search(val.toLocaleLowerCase()) !== -1);
        }
    }

    /**
     * Filter for operatorList observable list in view
     * @param {string} val
     * @return {Types[]}
     */
    private operatorFilter(val: string): Types[] {
        return this.operatorList.filter(operator =>
            operator.code.toLocaleLowerCase().search(val.toLocaleLowerCase()) !== -1);
    }


    get messageUTCSubscription(): Subscription {
        return this._messageUTCSubscription;
    }

    set messageUTCSubscription(value: Subscription) {
        this._messageUTCSubscription = value;
    }

    get aircraftList(): Aircraft[] {
        return this._aircraftList;
    }

    set aircraftList(value: Aircraft[]) {
        this._aircraftList = value;
    }

    get flightList(): Flight[] {
        return this._flightList;
    }

    set flightList(value: Flight[]) {
        this._flightList = value;
    }

    get statusCodes(): StatusCode[] {
        return this._statusCodes;
    }

    set statusCodes(value: StatusCode[]) {
        this._statusCodes = value;
    }

    get safetyEventList(): Safety[] {
        return this._safetyEventList;
    }

    set safetyEventList(value: Safety[]) {
        this._safetyEventList = value;
    }

    get groupTypeList(): GroupTypes[] {
        return this._groupTypeList;
    }

    set groupTypeList(value: GroupTypes[]) {
        this._groupTypeList = value;
    }

    get contingencyType(): Types[] {
        return this._contingencyType;
    }

    set contingencyType(value: Types[]) {
        this._contingencyType = value;
    }

    get operatorList(): Types[] {
        return this._operatorList;
    }

    set operatorList(value: Types[]) {
        this._operatorList = value;
    }

    get failureType(): Types[] {
        return this._failureType;
    }

    set failureType(value: Types[]) {
        this._failureType = value;
    }

    get informer(): Types[] {
        return this._informer;
    }

    set informer(value: Types[]) {
        this._informer = value;
    }

    get contingencyForm(): FormGroup {
        return this._contingencyForm;
    }

    set contingencyForm(value: FormGroup) {
        this._contingencyForm = value;
    }

    get contingency(): Contingency {
        return this._contingency;
    }

    set contingency(value: Contingency) {
        this._contingency = value;
    }

    get stations(): Location[] {
        return this._stations;
    }

    set stations(value: Location[]) {
        this._stations = value;
    }

    get durationArray(): number[] {
        return this._durationArray;
    }

    set durationArray(value: number[]) {
        this._durationArray = value;
    }

    get utcModel(): TimeInstant {
        return this._utcModel;
    }

    set utcModel(value: TimeInstant) {
        this._utcModel = value;
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

    get snackbarMessage(): string {
        return this._snackbarMessage;
    }

    set snackbarMessage(value: string) {
        this._snackbarMessage = value;
    }

    get isSafetyEvent(): boolean {
        return this._isSafetyEvent;
    }

    set isSafetyEvent(value: boolean) {
        this._isSafetyEvent = value;
    }

    get timeClock(): Date {
        return this._timeClock;
    }

    set timeClock(value: Date) {
        this._timeClock = value;
    }

    get validations(): Validation {
        return this._validations;
    }

    set validations(value: Validation) {
        this._validations = value;
    }

    get contingencyDateModel(): DateModel[] {
        return this._contingencyDateModel;
    }

    set contingencyDateModel(value: DateModel[]) {
        this._contingencyDateModel = value;
    }

    get observableFlightList(): Observable<Flight[]> {
        return this._observableFlightList;
    }

    set observableFlightList(value: Observable<Flight[]>) {
        this._observableFlightList = value;
    }

    get observableAircraftList(): Observable<Aircraft[]> {
        return this._observableAircraftList;
    }

    set observableAircraftList(value: Observable<Aircraft[]>) {
        this._observableAircraftList = value;
    }

    get observableLocationList(): Observable<Location[]> {
        return this._observableLocationList;
    }

    set observableLocationList(value: Observable<Location[]>) {
        this._observableLocationList = value;
    }

    get observableOperatorList(): Observable<Types[]> {
        return this._observableOperatorList;
    }

    set observableOperatorList(value: Observable<Types[]>) {
        this._observableOperatorList = value;
    }

}
