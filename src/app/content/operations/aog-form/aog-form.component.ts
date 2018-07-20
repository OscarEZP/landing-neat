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
import {TranslateService} from '@ngx-translate/core';
import {StorageService} from '../../../shared/_services/storage.service';
import {DataService} from '../../../shared/_services/data.service';
import {CancelComponent} from '../cancel/cancel.component';
import {ContingencyService} from '../../_services/contingency.service';
import {Contingency} from '../../../shared/_models/contingency/contingency';
import {MatSnackBarRef} from '@angular/material/snack-bar/typings/snack-bar-ref';
import {TranslationService} from '../../../shared/_services/translation.service';

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
    private static CONTINGENCY_SEARCH_ENDPOINT = 'contingencySearch';

    private static DATE_FORMAT = 'dd MMM yyyy ';
    private static HOUR_FORMAT = 'HH:mm:ss';

    private static CLOSE_CONTINGENCY_ERROR_MESSAGE = 'AOG.AOG_FORM.ERROR.CLOSE_CONTINGENCY';
    private static VALIDATION_ERROR_MESSAGE = 'OPERATIONS.VALIDATION_ERROR_MESSAGE';
    private static CANCEL_COMPONENT_MESSAGE = 'OPERATIONS.CANCEL_COMPONENT.MESSAGE';
    private static CONTINGENCY_MESSAGE = 'AOG.AOG_FORM.MESSAGE.CONTINGENCY_DATA';
    private static AOG_SUCCESS_MESSAGE = 'AOG.AOG_FORM.MESSAGE.SUCCESS';

    private static MINUTE_ABBREVIATION = 'FORM.MINUTE_ABBREVIATION';
    private static HOUR_ABBREVIATION = 'FORM.HOUR_ABBREVIATION';
    private static HOUR_LABEL = 'FORM.HOUR';
    private static HOURS_LABEL = 'FORM.HOURS';

    private static DEFAULT_DURATION = 60;
    private static AOG_TYPE = 'AOG';
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
    private _arrDuration: Array<number>;

    private _alive: boolean;
    private _interval: number;
    private _timeClock: Date;
    private _isSafety: boolean;
    private _contingency: Contingency;
    private _hourLabel: string;
    private _hoursLabel: string;
    private _minuteAbbreviation: string;
    private _hourAbbreviation: string;

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
    private _formSubs: Subscription;
    private _groupTypesSubs: Subscription;
    private _contingencySubs: Subscription;

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
        private _translationService: TranslationService
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
            'station': [this.aog.station, Validators.required],
            'safety': [!!this.aog.safety, Validators.required],
            'barcode': [this.aog.barcode, [Validators.pattern('^([a-zA-Z0-9])+'), Validators.maxLength(80)]],
            'safetyEventCode': [this.aog.safety, this.safetyEventValidator.bind(this)],
            'aogType': [this.aog.maintenance, Validators.required],
            'failure': [this.aog.failure, Validators.required],
            'observation': [this.aog.observation, [Validators.required, Validators.maxLength(400)]],
            'reason': [this.aog.reason, [Validators.required, Validators.maxLength(400)]],
            'duration': [AogFormComponent.DEFAULT_DURATION, Validators.required],
            'tipology': [this.aog.code],
            'closeObservation': ['']
        });
        this._arrDuration = this.getDurationIntervals();
    }

    ngOnInit() {
        this._groupTypesSubs = this.getGroupTypes();
        this._aircraftSubs = this.getAircraftSubs();
        this._operatorSubs = this.getOperatorSubs();
        this._locationSubs = this.getLocationSubs();
        this._safetyEventSubs = this.getSafetyEventSubs();
        this._timerSubs = this.getTimerSubs();
        this._datetimeSubs = new Subscription();
        this._safetyCheckSubs = this.getSafetyCheckSubs();
        this._clockSubs = this.getClockSubscription();
        this._formSubs = this.getFormSubs();
        this._contingencySubs = new Subscription();
        this.username = this._storageService.getCurrentUser().username;

        this._translationService.translate(AogFormComponent.MINUTE_ABBREVIATION).then(res => this._minuteAbbreviation = res);
        this._translationService.translate(AogFormComponent.HOUR_ABBREVIATION).then(res => this._hourAbbreviation = res);
        this._translationService.translate(AogFormComponent.HOURS_LABEL).then(res => this._hoursLabel = res);
        this._translationService.translate(AogFormComponent.HOUR_LABEL).then(res => this._hourLabel = res);
    }

    ngOnDestroy() {
        this._aircraftSubs.unsubscribe();
        this._operatorSubs.unsubscribe();
        this._locationSubs.unsubscribe();
        this._safetyEventSubs.unsubscribe();
        this._timerSubs.unsubscribe();
        this._datetimeSubs.unsubscribe();
        this._safetyCheckSubs.unsubscribe();
        this._clockSubs.unsubscribe();
        this._formSubs.unsubscribe();
        this._contingencySubs.unsubscribe();
    }

    /**
     * Array with 30 minutes intervals
     * @returns {number[]}
     */
    private getDurationIntervals(): number[] {
        const res = [];
        for (let i = 1; i * AogFormComponent.INTERVAL_DURATION <= AogFormComponent.INTERVAL_LIMIT; i++) {
            res.push(i * AogFormComponent.INTERVAL_DURATION);
        }
        return res;
    }

    /**
     * Subscription to get data from AOG form
     * @returns {Subscription}
     */
    private getFormSubs(): Subscription {
        return this.aogForm.valueChanges.subscribe(v => {
            this.aog.station = v.station;
            this.aog.safety = this.isSafety ? v.safetyEventCode : '';
            this.aog.barcode = v.barcode;
            this.aog.maintenance = v.aogType;
            this.aog.failure = v.failure;
            this.aog.observation = v.observation;
            this.aog.reason = v.reason;
            this.aog.durationAog = v.duration;
            this.aog.code = v.tipology;
            if (this.contingency) {
                this.contingency.close.id = this.contingency.id;
                this.contingency.close.username = this.aog.username;
                this.contingency.close.type = AogFormComponent.AOG_TYPE;
                this.contingency.close.observation = v.closeObservation;
            }
        });
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
    private safetyEventValidator(control: FormControl): object {
        return !control.value && this.isSafety ? { isSafety: true } : null;
    }

    /**
     * Event to submit data
     */
    public submitForm(): void {
        if (this.aogForm.valid) {
            if (this.contingency) {
                this.postCloseContingency();
            } else {
                this.postAog();
            }
        } else {
            this._translationService.translateAndShow(AogFormComponent.VALIDATION_ERROR_MESSAGE);
        }
    }

    /**
     * Promise to send data
     * @returns {Promise<void>}
     */
    private postAog(): Promise<void> {
        return this._apiRestService
            .search(AogFormComponent.AOG_ENDPOINT, this.aog)
            .toPromise()
            .then(() => {
                this._translationService.translateAndShow(AogFormComponent.AOG_SUCCESS_MESSAGE);
                this._dialogService.closeAllDialogs();
                this._messageData.stringMessage('reload');
            }).catch(err => console.error(err));
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
                error => () => this._messageService.openSnackBar(error.message)
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
     * Method triggered when aircraft tail is selected, populate the fields and the model in contingency aircraft & flight
     * Also force selection of first flight in the form and recalculate the flight etd
     * @param {string} selectedOption
     */
    public onSelectAircraft(selectedOption: string): void {
        this.aircraftList
            .filter(a => a.tail === selectedOption)
            .forEach(a => {
                this.aog.tail = a.tail;
                this.aog.fleet = a.fleet;
                this.aog.operator = a.operator;
            });

        this.aogForm.get('operator').setValue(this.aog.operator);
        this.aogForm.get('operator').updateValueAndValidity();
        this.aogForm.get('fleet').setValue(this.aog.fleet);
        this.aogForm.get('fleet').updateValueAndValidity();

        this._contingencySubs = this.getContingencySubs();
    }

    /**
     * Promise to close a current contingency with the same barcode as the new AOG
     * @returns {Promise<void>}
     */
    private postCloseContingency(): Promise<void> {
        return this._contingencyService.closeContingency(this.contingency.close)
            .toPromise()
            .then(() => this.postAog())
            .catch( () => this._translationService.translateAndShow(AogFormComponent.CLOSE_CONTINGENCY_ERROR_MESSAGE));
    }

    /**
     * Subscription to get a contingency
     * @returns {Subscription}
     */
    private getContingencySubs(): Subscription {
        return this._apiRestService.search<Contingency[]>(AogFormComponent.CONTINGENCY_SEARCH_ENDPOINT, this.getContingencySignature())
            .subscribe(v => {
                this.contingency = v.length > 0 ? v.shift() : null;
                if (this.contingency) {
                    this.showContingencyConfirm();
                }
            });
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
    private handleContingencyConfirm(ref: MatSnackBarRef<any>): Promise<void> {
        return ref.afterDismissed()
            .toPromise()
            .then(() => {
                if (ref.instance.response === CancelComponent.ACCEPT) {
                    this.aogForm.setValue({
                        'tail': this.aog.tail,
                        'fleet': this.aog.fleet,
                        'operator': this.aog.operator,
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
                    this.aogForm.reset();
                    this.contingency = null;
                }
            });
    }

    /**
     * Signature to search a contingency before to save an AOG
     * @returns {{isClose: boolean; tails: string[]}}
     */
    private getContingencySignature(): {isClose: boolean, tails: string[]} {
        return { isClose: false, tails : [this.aogForm.controls['tail'].value] };
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
            return res.find(item => item.tail === tail) ? null : { tailDomain: true };
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
            return res.find(item => operator === item.code) ? null : { operatorDomain: true };
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

    getDurationLabel(duration: number): string {
        const minToHour = 60;
        const durationToHours = duration / minToHour;
        const hours = Math.floor(durationToHours);
        return durationToHours === hours ?
            hours.toString()
                .concat(' ')
                .concat(hours > 1 ? this.hoursLabel : this.hourLabel) :
            hours.toString()
                .concat(this.hourAbbreviation)
                .concat(' ')
                .concat((duration - (hours * minToHour)).toString())
                .concat(this.minuteAbbreviation);
    }

    /**
     * Set an username in the AOG instance
     * @param {string} value
     */
    set username(value: string) {
        this.aog.username = value;
        this.aog.status.username = value;
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

    get arrDuration(): Array<number> {
        return this._arrDuration;
    }

    set arrDuration(value: Array<number>) {
        this._arrDuration = value;
    }

    get hourLabel(): string {
        return this._hourLabel;
    }

    get hoursLabel(): string {
        return this._hoursLabel;
    }

    get minuteAbbreviation(): string {
        return this._minuteAbbreviation;
    }

    get hourAbbreviation(): string {
        return this._hourAbbreviation;
    }

}
