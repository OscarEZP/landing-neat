import {Component, OnDestroy, OnInit} from '@angular/core';
import {DialogService} from '../../_services/dialog.service';
import {TimeInstant} from '../../../shared/_models/timeInstant';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';
import {TimerObservable} from 'rxjs/observable/TimerObservable';
import {Aog} from '../../../shared/_models/aog/aog';
import {DatetimeService} from '../../../shared/_services/datetime.service';
import {Observable} from 'rxjs/Observable';
import {Aircraft} from '../../../shared/_models/aircraft';
import {Types} from '../../../shared/_models/configuration/types';
import {Location} from '../../../shared/_models/configuration/location';
import {GroupTypes} from '../../../shared/_models/configuration/groupTypes';
import {ApiRestService} from '../../../shared/_services/apiRest.service';
import {map, startWith} from 'rxjs/operators';
import {AircraftSearch} from '../../../shared/_models/configuration/aircraftSearch';
import {Safety} from '../../../shared/_models/safety';
import {MessageService} from '../../../shared/_services/message.service';
import {ClockService} from '../../../shared/_services/clock.service';
import {StorageService} from '../../../shared/_services/storage.service';
import {DataService} from '../../../shared/_services/data.service';
import {CancelComponent} from '../cancel/cancel.component';
import {ContingencyService} from '../../_services/contingency.service';
import {Contingency} from '../../../shared/_models/contingency/contingency';
import {MatSnackBarRef} from '@angular/material/snack-bar/typings/snack-bar-ref';
import {TranslationService} from '../../../shared/_services/translation.service';
import {AogService} from '../../_services/aog.service';
import {SearchContingency} from '../../../shared/_models/contingency/searchContingency';
import {Close} from '../../../shared/_models/contingency/close';
import {DurationInterface, TimeService} from '../../../shared/_services/timeService';

@Component({
    selector: 'lsl-aog-form',
    templateUrl: './aog-form.component.html',
    styleUrls: ['./aog-form.component.scss']
})
export class AogFormComponent implements OnInit, OnDestroy {

    private static TYPES_LIST_ENDPOINT = 'types';
    private static AIRCRAFTS_SEARCH_ENDPOINT = 'aircraftsSearch';
    private static OPERATOR_LIST_ENDPOINT = 'operator';
    private static SAFETY_EVENT_LIST_ENDPOINT = 'safetyEvent';
    private static LOCATIONS_ENDPOINT = 'locations';
    private static AOG_ENDPOINT = 'aircraftOnGround';

    private static DATE_FORMAT = 'dd MMM yyyy ';
    private static HOUR_FORMAT = 'HH:mm:ss';

    private static ERRORS_DEFAULT = 'ERRORS.DEFAULT';
    private static CLOSE_CONTINGENCY_ERROR_MESSAGE = 'AOG.AOG_FORM.ERROR.CLOSE_CONTINGENCY';
    private static VALIDATION_TAIL_AOG_ERROR_MESSAGE = 'TAIL.ERROR.AOG_ACTIVE';
    private static VALIDATION_ERROR_MESSAGE = 'OPERATIONS.VALIDATION_ERROR_MESSAGE';
    private static CANCEL_COMPONENT_MESSAGE = 'OPERATIONS.CANCEL_COMPONENT.MESSAGE';
    private static CONTINGENCY_MESSAGE = 'AOG.AOG_FORM.MESSAGE.CONTINGENCY_DATA';
    private static AOG_SUCCESS_MESSAGE = 'AOG.AOG_FORM.MESSAGE.SUCCESS';

    private static AOG_TYPE = 'AOG';
    private static INTERVAL_DEFAULT = 60;
    private static INTERVAL_DURATION = 30;
    private static INTERVAL_LIMIT = 1440;

    private _utcModel: TimeInstant;
    private _aogForm: FormGroup;
    private _aog: Aog;
    private _aircraftList: Aircraft[];
    private _operatorList: Types[];
    private _groupTypeList: GroupTypes[];
    private _locationList: Location[];
    private _safetyEventList: Safety[];

    private _alive: boolean;
    private _interval: number;
    private _timeClock: Date;
    private _isSafety: boolean;
    private _contingency: Contingency;
    private _durationIntervals: DurationInterface[];

    private _locationList$: Observable<Location[]>;
    private _aircraftList$: Observable<Aircraft[]>;
    private _operatorList$: Observable<Types[]>;

    private _timerSubs: Subscription;
    private _datetimeSubs: Subscription;
    private _aircraftSubs: Subscription;
    private _operatorSubs: Subscription;
    private _locationSubs: Subscription;
    private _safetyEventSubs: Subscription;
    private _safetyCheckSubs: Subscription;
    private _clockSubs: Subscription;
    private _groupTypesSubs: Subscription;

    private _contingencyType: string;
    private _failureType: string;
    private _aogStatus: string;

    constructor(
        private _dialogService: DialogService,
        private _fb: FormBuilder,
        private _datetimeService: DatetimeService,
        private _apiRestService: ApiRestService,
        private _messageService: MessageService,
        private _clockService: ClockService,
        private _storageService: StorageService,
        private _messageData: DataService,
        private _contingencyService: ContingencyService,
        private _aogService: AogService,
        private _translationService: TranslationService,
        private _timeService: TimeService
    ) {
        this._utcModel = new TimeInstant(new Date().getTime(), null);
        this._alive = true;
        this._interval = 1000 * 60;
        this._contingency = null;
        this._aog = Aog.getInstance();
        this._aogForm = _fb.group({
            'tail': [this.aog.tail, Validators.required, this.tailDomainValidator.bind(this)],
            'fleet': [this.aog.fleet, Validators.required],
            'operator': [this.aog.operator, Validators.required, this.operatorDomainValidator.bind(this)],
            'station': [this.aog.station, [Validators.required, Validators.maxLength(3)]],
            'safety': [!!this.aog.safety, Validators.required],
            'barcode': [this.aog.barcode, [Validators.pattern('^([a-zA-Z0-9])+'), Validators.maxLength(80)]],
            'safetyEventCode': [this.aog.safety, this.safetyEventValidator.bind(this)],
            'aogType': [this.aog.maintenance, Validators.required],
            'failure': [this.aog.failure, Validators.required],
            'observation': [this.aog.observation, [Validators.required, Validators.maxLength(400)]],
            'reason': [this.aog.reason, [Validators.required, Validators.maxLength(400)]],
            'duration': [AogFormComponent.INTERVAL_DEFAULT, Validators.required],
            'tipology': [this.aog.code],
            'closeObservation': ['']
        });
        this._groupTypesSubs = new Subscription();
        this._aircraftSubs = new Subscription();
        this._operatorSubs = new Subscription();
        this._locationSubs = new Subscription();
        this._safetyEventSubs = new Subscription();
        this._timerSubs = new Subscription();
        this._datetimeSubs = new Subscription();
        this._safetyCheckSubs = new Subscription();
        this._clockSubs = new Subscription();

        this._contingencyType = '';
        this._failureType = '';
        this._aogStatus = '';
        this._durationIntervals = [];
    }

    ngOnInit() {
        this.username = this._storageService.getCurrentUser().username;
        this.groupTypesSubs = this.getGroupTypes();
        this.aircraftSubs = this.getAircraftSubs();
        this.operatorSubs = this.getOperatorSubs();
        this.locationSubs = this.getLocationSubs();
        this.safetyEventSubs = this.getSafetyEventSubs();
        this.timerSubs = this.getTimerSubs();
        this.safetyCheckSubs = this.getSafetyCheckSubs();
        this.clockSubs = this.getClockSubscription();
        this.username = this._storageService.getCurrentUser().username;
        this.durationIntervals = this._timeService.getDurationIntervals(AogFormComponent.INTERVAL_DURATION, AogFormComponent.INTERVAL_LIMIT);
    }

    ngOnDestroy() {
        this.groupTypesSubs.unsubscribe();
        this.aircraftSubs.unsubscribe();
        this.operatorSubs.unsubscribe();
        this.locationSubs.unsubscribe();
        this.safetyEventSubs.unsubscribe();
        this.timerSubs.unsubscribe();
        this.datetimeSubs.unsubscribe();
        this.safetyCheckSubs.unsubscribe();
        this.clockSubs.unsubscribe();
    }

    /**
     * Get Aog from Aog Form
     * @param {Aog} aog
     * @param {FormGroup} formGroup
     * @returns {Aog}
     */
    public getAogFromForm(aog: Aog, formGroup: FormGroup): Aog {
        const controls = formGroup.controls;
        aog.station = controls.station.value;
        aog.safety = this.isSafety ? controls.safetyEventCode.value : '';
        aog.barcode = controls.barcode.value;
        aog.maintenance = controls.aogType.value;
        aog.failure = controls.failure.value;
        aog.observation = controls.observation.value;
        aog.reason = controls.reason.value;
        aog.durationAog = controls.duration.value;
        aog.code = controls.tipology.value;
        aog.fleet = controls.fleet.value;
        aog.operator = controls.operator.value;
        aog.tail = controls.tail.value;
        return aog;
    }

    /**
     * Get a close signature were there is a contingency related
     * @param {number} id
     * @param {string} username
     * @param {string} observation
     * @returns {Close}
     */
    private getCloseForContingency(id: number, username: string, observation: string): Close {
        const close = new Close();
        close.id = id;
        close.username = username;
        close.type = AogFormComponent.AOG_TYPE;
        close.observation = observation;
        return close;
    }

    /**
     * Subscription to set time
     * @returns {Subscription}
     */
    private getClockSubscription(): Subscription {
        return this._clockService.getClock().subscribe(time => this.timeClock = time);
    }

    /**
     * Subscription to get the safety checkbox status
     * @returns {Subscription}
     */
    private getSafetyCheckSubs(): Subscription {
        return this.aogForm.controls['safety']
            .valueChanges
            .subscribe(v => {
                this.isSafety = v;
                if (!v) {
                    this.aogForm.controls['safetyEventCode'].setValue('');
                    this.aogForm.controls['safety'].markAsPristine();
                }
            });
    }

    /**
     * Validator to safety event data
     * @param {FormControl} control
     * @returns {object}
     */
    public safetyEventValidator(control: FormControl): object {
        return !control.value && this.isSafety ? {isSafety: true} : null;
    }

    /**
     * Submit data, if there is a contingency related, then close it
     */
    public submitForm(): void {
        if (this.aogForm.valid) {
            this.aog = this.getAogFromForm(this.aog, this.aogForm);
            if (this.contingency) {
                this.contingency.close = this.getCloseForContingency(this.contingency.id, this.aog.audit.username, this.aogForm.controls.closeObservation.value);
                this.postCloseContingency(this.contingency.close, this.aog);
            } else {
                this.postAog(this.aog);
            }
        } else {
            this._translationService.translateAndShow(AogFormComponent.VALIDATION_ERROR_MESSAGE);
        }
    }

    /**
     * Promise to send data
     * @returns {Promise<void>}
     */
    private postAog(aog: Aog): Promise<void> {
        return this._apiRestService
            .search(AogFormComponent.AOG_ENDPOINT, aog)
            .toPromise()
            .then(() => {
                this._translationService.translateAndShow(AogFormComponent.AOG_SUCCESS_MESSAGE);
                this._dialogService.closeAllDialogs();
                this._messageData.stringMessage('reload');
            }).catch(error => this._messageService.openSnackBar(error.message));
    }

    /**
     * Get Safety Event List Configuration
     * @return {Subscription}
     */
    private getSafetyEventSubs(): Subscription {
        return this._apiRestService
            .getAll<Safety[]>(AogFormComponent.SAFETY_EVENT_LIST_ENDPOINT)
            .subscribe(
                data => this.safetyEventList = data,
                error => this._messageService.openSnackBar(error.message)
            );
    }

    /**
     * Get aircraft list and create an observable list of fligths will be consumed in the view
     * @return {Subscription}
     */
    private getAircraftSubs(): Subscription {
        return this._apiRestService
            .search<Aircraft[]>(AogFormComponent.AIRCRAFTS_SEARCH_ENDPOINT, new AircraftSearch(1))
            .subscribe((response: Aircraft[]) => {
                this.aircraftList = response;
                this.aircraftList$ = this.aogForm
                    .controls['tail']
                    .valueChanges
                    .pipe(
                        startWith(''),
                        map(val => this.aircraftFilter(val))
                    );
            });
    }

    /**
     * Get operator list configuration
     * @return {Subscription}
     */
    private getOperatorSubs(): Subscription {
        return this._apiRestService
            .getAll<Types[]>(AogFormComponent.OPERATOR_LIST_ENDPOINT)
            .subscribe(response => {
                this.operatorList = response;
                this.operatorList$ = this.aogForm
                    .controls['operator']
                    .valueChanges
                    .pipe(
                        startWith(''),
                        map(val => this.operatorFilter(val))
                    );
            });
    }

    /**
     * Get the location list from server
     * @return {Subscription}
     */
    private getLocationSubs(): Subscription {
        return this._apiRestService
            .getAll<Location[]>(AogFormComponent.LOCATIONS_ENDPOINT)
            .subscribe((response: Location[]) => {
                this.locationList = response;
                this.locationList$ = this.aogForm
                    .controls['station']
                    .valueChanges
                    .pipe(
                        startWith(''),
                        map(val => this.locationFilter(val))
                    );
            });
    }

    /**
     * Filter for location observable list in view
     * @param {string} val
     * @return {Location[]}
     */
    private locationFilter(val: string): Location[] {
        return this.locationList.filter(location =>
            location.code.toLocaleLowerCase().search(val ? val.toLocaleLowerCase() : '') !== -1);
    }

    /**
     * Filter for operatorList observable list in view
     * @param {string} val
     * @return {Types[]}
     */
    private operatorFilter(val: string): Types[] {
        return this.operatorList.filter(operator =>
            operator.code.toLocaleLowerCase().search(val ? val.toLocaleLowerCase() : '') !== -1);
    }

    /**
     * Filter for aircraft observable list in view
     * @param {string} val
     * @return {Aircraft[]}
     */
    private aircraftFilter(val: string): Aircraft[] {
        return this.aircraftList.filter(aircraft =>
            aircraft.tail.toLocaleLowerCase().search(val ? val.toLocaleLowerCase() : '') !== -1);
    }

    /**
     * Method triggered when aircraft tail is selected, populate the fields and the model in aog aircraft & flight
     * Also validates tail in active Contingency or AOG
     * @param {string} tail
     */
    public onSelectAircraft(tail: string): void {

        if (this.contingency) {
            this.contingency =  null;
            this.aogForm.reset();
            this.aogForm.get('tail').setValue(tail);
        }
        this.completeAircraft(tail);
        const search: SearchContingency = SearchContingency.getInstance();
        search.isClose = false;
        search.tails = [tail];
        this._aogService.validateTail(tail)
            .then(aog => {
                if (aog) {
                    this._contingencyService.search(search).toPromise().then(res => {
                        this.contingency = res.length > 0 ? res.shift() : null;
                        if (this.contingency) {
                            this.showContingencyConfirm();
                        }
                    }).catch(() => this._translationService.translateAndShow(AogFormComponent.ERRORS_DEFAULT));
                } else {
                    this.aogForm.get('operator').setValue(null);
                    this.aogForm.get('fleet').setValue(null);
                    this._translationService.translateAndShow(AogFormComponent.VALIDATION_TAIL_AOG_ERROR_MESSAGE, 2500, {value: tail});
                }
            }).catch(() => this._translationService.translateAndShow(AogFormComponent.ERRORS_DEFAULT));
    }

    /**
     *Complete Aircraft information (fleet|operator|
     * @param {string} tail
     */
    public completeAircraft(tail: string): void {
        const aircraft = this.aircraftList.find(a => a.tail === tail);
        if (aircraft) {
            this.aog.tail = aircraft.tail;
            this.aog.fleet = aircraft.fleet;
            this.aog.operator = aircraft.operator;
        }
        this.aogForm.get('operator').setValue(this.aog.operator);
        this.aogForm.get('operator').updateValueAndValidity();
        this.aogForm.get('fleet').setValue(this.aog.fleet);
        this.aogForm.get('fleet').updateValueAndValidity();
    }

    /**
     * Promise to close a current contingency with the same barcode as the new AOG
     * @returns {Promise<void>}
     */
    private postCloseContingency(close: Close, aog: Aog): Promise<void> {
        return this._contingencyService.closeContingency(close)
            .toPromise()
            .then(() => this.postAog(aog))
            .catch(() => this._translationService.translateAndShow(AogFormComponent.CLOSE_CONTINGENCY_ERROR_MESSAGE));
    }

    /**
     * Promise to show a confirm message when there is a Contingency
     * @returns {Promise<void>}
     */
    private showContingencyConfirm(): Promise<void> {
        return this._translationService.translate(AogFormComponent.CONTINGENCY_MESSAGE, {value: this.aog.tail})
            .then((res: string) => {
                const ref = this._messageService.openFromComponent(CancelComponent, {
                    data: {message: res, closeAll: false},
                    horizontalPosition: 'center',
                    verticalPosition: 'top'
                });
                this.handleContingencyConfirm(ref).catch(err => console.error(err));
            })
            .catch(err => console.error(err));
    }

    /**
     * Handler after dismiss the confirm message
     * @param {MatSnackBarRef<any>} ref
     * @returns {Promise<void>}
     */
    public handleContingencyConfirm(ref: MatSnackBarRef<any>): Promise<void> {
        return ref.afterDismissed()
            .toPromise()
            .then(() => {
                if (ref.instance.response === CancelComponent.ACCEPT) {
                    this.aogForm.setValue({
                        'tail': this.contingency.aircraft.tail,
                        'fleet': this.contingency.aircraft.fleet,
                        'operator': this.contingency.aircraft.operator,
                        'barcode': this.contingency.barcode,
                        'station': this.contingency.flight.origin,
                        'safety': !!this.contingency.safetyEvent.code,
                        'safetyEventCode': this.contingency.safetyEvent.code,
                        'aogType': this.contingency.type,
                        'failure': this.contingency.failure,
                        'reason': this.contingency.reason,
                        'observation': this.aog.observation,
                        'duration': this.aogForm.controls['duration'].value,
                        'tipology': this.aog.code,
                        'closeObservation': ''
                    });
                    this.aogForm.controls['closeObservation'].setValidators(Validators.required);
                } else {
                    this.aogForm.get('operator').setValue(null);
                    this.aogForm.get('fleet').setValue(null);
                    this.contingency = null;
                    this.aogForm.controls['closeObservation'].clearValidators();
                }
            });
    }


    /**
     * Get all group types
     * @return {Subscription}
     */
    private getGroupTypes(): Subscription {
        return this._apiRestService
            .getAll<GroupTypes[]>(AogFormComponent.TYPES_LIST_ENDPOINT)
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
            if (variableName === 'contingencyType') {
                value.types.sort((a, b) => a.description < b.description ? 1 : -1);
            }
            this[variableName] = value.types;
        }, this);
    }

    /**
     * Subscription for get a timer
     * @returns {Subscription}
     */
    private getTimerSubs(): Subscription {
        return TimerObservable.create(0, this.interval)
            .takeWhile(() => this.alive)
            .subscribe(() => {
                this._datetimeSubs = this._datetimeService.getTime()
                    .subscribe((data) => {
                        this.utcModel = new TimeInstant(data.currentTimeLong, data.currentTime);
                    });
            });
    }

    /**
     * Custom validation for Aircraft Tail
     * @param {FormControl} control
     * @return {Observable<any>}
     */
    public tailDomainValidator(control: FormControl): Observable<any> {
        const tail = control.value;
        return Observable.of(this.aircraftList).map(res => {
            return res.find(item => item.tail === tail) ? null : {tailDomain: true};
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
            return res && res.find(item => operator === item.code) ? null : {operatorDomain: true};
        });
    }

    /**
     * Open a cancel message if there is a filled item
     */
    public openCancelDialog(): void {
        if (this.aogForm.pristine) {
            this._dialogService.closeAllDialogs();
        } else {
            this._translationService.translate(AogFormComponent.CANCEL_COMPONENT_MESSAGE)
                .then((res: string) => {
                    this._messageService.openFromComponent(CancelComponent, {
                        data: {message: res},
                        horizontalPosition: 'center',
                        verticalPosition: 'top'
                    });
                })
                .catch(err => console.error(err));
        }
    }

    /**
     * Set an username in the AOG instance
     * @param {string} value
     */
    set username(value: string) {
        this.aog.audit.username = value;
        this.aog.status.audit.username = value;
    }

    get utcModel(): TimeInstant {
        return this._utcModel;
    }

    set utcModel(value: TimeInstant) {
        this._utcModel = value;
    }

    get aogForm(): FormGroup {
        return this._aogForm;
    }

    set aogForm(value: FormGroup) {
        this._aogForm = value;
    }

    get aog(): Aog {
        return this._aog;
    }

    set aog(value: Aog) {
        this._aog = value;
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

    get aircraftList(): Aircraft[] {
        return this._aircraftList;
    }

    set aircraftList(value: Aircraft[]) {
        this._aircraftList = value;
    }

    get operatorList(): Types[] {
        return this._operatorList;
    }

    set operatorList(value: Types[]) {
        this._operatorList = value;
    }

    get locationList$(): Observable<Location[]> {
        return this._locationList$;
    }

    set locationList$(value: Observable<Location[]>) {
        this._locationList$ = value;
    }

    get aircraftList$(): Observable<Aircraft[]> {
        return this._aircraftList$;
    }

    set aircraftList$(value: Observable<Aircraft[]>) {
        this._aircraftList$ = value;
    }

    get operatorList$(): Observable<Types[]> {
        return this._operatorList$;
    }

    set operatorList$(value: Observable<Types[]>) {
        this._operatorList$ = value;
    }

    get groupTypeList(): GroupTypes[] {
        return this._groupTypeList;
    }

    set groupTypeList(value: GroupTypes[]) {
        this._groupTypeList = value;
    }

    get locationList(): Location[] {
        return this._locationList;
    }

    set locationList(value: Location[]) {
        this._locationList = value;
    }

    get safetyEventList(): Safety[] {
        return this._safetyEventList;
    }

    set safetyEventList(value: Safety[]) {
        this._safetyEventList = value;
    }

    get dateFormat(): string {
        return AogFormComponent.DATE_FORMAT;
    }

    get hourFormat(): string {
        return AogFormComponent.HOUR_FORMAT;
    }

    get timeClock(): Date {
        return this._timeClock;
    }

    set timeClock(value: Date) {
        this._timeClock = value;
    }

    get isSafety(): boolean {
        return this._isSafety;
    }

    set isSafety(value: boolean) {
        this._isSafety = value;
    }

    get contingency(): Contingency {
        return this._contingency;
    }

    set contingency(value: Contingency) {
        this._contingency = value;
    }

    get timerSubs(): Subscription {
        return this._timerSubs;
    }

    set timerSubs(value: Subscription) {
        this._timerSubs = value;
    }

    get datetimeSubs(): Subscription {
        return this._datetimeSubs;
    }

    set datetimeSubs(value: Subscription) {
        this._datetimeSubs = value;
    }

    get aircraftSubs(): Subscription {
        return this._aircraftSubs;
    }

    set aircraftSubs(value: Subscription) {
        this._aircraftSubs = value;
    }

    get operatorSubs(): Subscription {
        return this._operatorSubs;
    }

    set operatorSubs(value: Subscription) {
        this._operatorSubs = value;
    }

    get locationSubs(): Subscription {
        return this._locationSubs;
    }

    set locationSubs(value: Subscription) {
        this._locationSubs = value;
    }

    get safetyEventSubs(): Subscription {
        return this._safetyEventSubs;
    }

    set safetyEventSubs(value: Subscription) {
        this._safetyEventSubs = value;
    }

    get safetyCheckSubs(): Subscription {
        return this._safetyCheckSubs;
    }

    set safetyCheckSubs(value: Subscription) {
        this._safetyCheckSubs = value;
    }

    get clockSubs(): Subscription {
        return this._clockSubs;
    }

    set clockSubs(value: Subscription) {
        this._clockSubs = value;
    }

    get groupTypesSubs(): Subscription {
        return this._groupTypesSubs;
    }

    set groupTypesSubs(value: Subscription) {
        this._groupTypesSubs = value;
    }

    get contingencyType(): string {
        return this._contingencyType;
    }

    set contingencyType(value: string) {
        this._contingencyType = value;
    }

    get failureType(): string {
        return this._failureType;
    }

    set failureType(value: string) {
        this._failureType = value;
    }

    get aogStatus(): string {
        return this._aogStatus;
    }

    set aogStatus(value: string) {
        this._aogStatus = value;
    }

    get durationIntervals(): DurationInterface[] {
        return this._durationIntervals;
    }

    set durationIntervals(value: DurationInterface[]) {
        this._durationIntervals = value;
    }
}
