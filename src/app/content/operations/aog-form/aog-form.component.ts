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

    private static DATE_FORMAT = 'dd MMM yyyy ';
    private static HOUR_FORMAT = 'HH:mm:ss';

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

    private _locationList$: Observable<Location[]>;
    private _aircraftList$: Observable<Aircraft[]>;
    private _operatorList$: Observable<Types[]>;

    private _timerSubs: Subscription;
    private _datetimeSubs: Subscription;
    private _aircraftSubs: Subscription;
    private _operatorSubs: Subscription;
    private _locationSubs: Subscription;
    private _safetyEventSubs: Subscription;

    private _failureType: Types[];

    constructor(
        private _dialogService: DialogService,
        private _fb: FormBuilder,
        private _datetimeService: DatetimeService,
        private _apiRestService: ApiRestService,
        private _messageService: MessageService
    ) {
        this.utcModel = new TimeInstant(new Date().getTime(), null);
        this.alive = true;
        this.interval = 1000 * 60;

        this._aog = Aog.getInstance();
        this._aogForm = _fb.group({
            'tail': [this.aog.tail, Validators.required, this.tailDomainValidator.bind(this)],
            'fleet': [this.aog.fleet, Validators.required],
            'operator': [this.aog.operator, Validators.required, this.operatorDomainValidator.bind(this)],
            'station': ['', Validators.required],
            'safety': [false, Validators.required],
            'barcode': [this.aog.barcode, [Validators.pattern('^([a-zA-Z0-9])+'), Validators.maxLength(80)]],
            'safetyEventCode': [''],
            'aogType': ['', Validators.required],
            'failure': ['', Validators.required],
            'observation': ['', [Validators.required, Validators.maxLength(400)]],
            'reason': [this.aog.reason, [Validators.required, Validators.maxLength(400)]],
            'statusCode': [this.aog.status, Validators.required],
            'duration': [this.aog.durationAog, Validators.required],
            'tipology': ['']
        });

        this.getGroupTypes();
    }

    ngOnInit() {
        this._aircraftSubs = this.getAircraftList();
        this._operatorSubs = this.getOperatorList();
        this._locationSubs = this.getLocationList();
        this._safetyEventSubs = this.getSafetyEventList();
        this._timerSubs = this.getTimerSubs();
    }

    ngOnDestroy() {
        this._aircraftSubs.unsubscribe();
        this._operatorSubs.unsubscribe();
        this._locationSubs.unsubscribe();
        this._safetyEventSubs.unsubscribe();
        this._timerSubs.unsubscribe();
        if (this._datetimeSubs) {
            this._datetimeSubs.unsubscribe();
        }
    }

    public submitForm() {
        console.log('submit!');
        if (this.aogForm.valid) {

        }
    }

    /**
     * Get Safety Event List Configuration
     * @return {Subscription}
     */

    private getSafetyEventList(): Subscription {
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
    private getAircraftList(): Subscription {
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
    private getOperatorList(): Subscription {
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
    private getLocationList(): Subscription {
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
        if (val !== null) {
            return this.locationList.filter(location =>
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

    private getTimerSubs(): Subscription {
        return TimerObservable.create(0, this.interval)
            .takeWhile(() => this.alive)
            .subscribe(() => {
                this._datetimeSubs = this._datetimeService.getTime()
                    .subscribe((data) => {
                        this.utcModel = new TimeInstant(data.currentTimeLong, data.currentTime);
                        // this.newMessage();
                        // this.initDateModels(this.utcMode                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             zl.epochTime);
                        // this._clockService.setClock(this.utcModel.epochTime);
                        // this.aog.openAogDate = new TimeInstant(data.currentTimeLong, data.currentTime);
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


    get failureType(): Types[] {
        return this._failureType;
    }

    set failureType(value: Types[]) {
        this._failureType = value;
    }

    /**
     * Open a cancel message if there is a filled item
     */
    public openCancelDialog(): void {
        this._dialogService.closeAllDialogs();
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
}
