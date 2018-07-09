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

@Component({
    selector: 'lsl-aog-form',
    templateUrl: './aog-form.component.html',
    styleUrls: ['./aog-form.component.scss']
})
export class AogFormComponent implements OnInit, OnDestroy {

    private static TYPES_LIST_ENDPOINT = 'types';

    private _utcModel: TimeInstant;
    private _aogForm: FormGroup;
    private _aog: Aog;
    private _aircraftList: Aircraft[];
    private _operatorList: Types[];
    private _groupTypeList: GroupTypes[];

    private _alive: boolean;
    private _interval: number;

    private _locationList$: Observable<Location[]>;

    private _timerSubs: Subscription;
    private _datetimeSubs: Subscription;
    private _failureType: Types[];


    constructor(
        private _dialogService: DialogService,
        private _fb: FormBuilder,
        private _datetimeService: DatetimeService,
        private _apiRestService: ApiRestService
    ) {
        this.utcModel = new TimeInstant(new Date().getTime(), null);
        this.alive = true;
        this.interval = 1000 * 60;

        this._timerSubs = this.getTimerSubs();
        this._aog = new Aog();
        this._aogForm = _fb.group({
            'tail': [this.aog.tail, Validators.required, this.tailDomainValidator.bind(this)],
            'fleet': [this.aog.fleet, Validators.required],
            'operator': [this.aog.operator, Validators.required, this.operatorDomainValidator.bind(this)],
            // 'isBackup': [false, this.contingency.isBackup],
            'station': ['', Validators.required],
            // 'slotTm': [this.contingencyDateModel[1].timeString],
            // 'slotDate': [this.contingencyDateModel[1].dateString],
            // 'flightNumber': [this.contingency.flight.flightNumber, Validators.required],
            // 'origin': [this.contingency.flight.origin, Validators.required],
            // 'destination': [this.contingency.flight.destination, Validators.required],
            // 'tm': [this.contingencyDateModel[0].timeString, Validators.required],
            // 'dt': [this.contingencyDateModel[0].dateString, Validators.required],
            // 'informer': [this.contingency.informer, Validators.required],
            'safety': [false, Validators.required],
            // 'showBarcode': [false],
            'barcode': [this.aog.barcode, [Validators.pattern('^[a-zA-Z0-9]+\\S$'), Validators.maxLength(80)]],
            'safetyEventCode': [''],
            'contingencyType': ['', Validators.required],
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

    }

    ngOnDestroy() {
        this._timerSubs.unsubscribe();
        if (this._datetimeSubs) {
            this._datetimeSubs.unsubscribe();
        }
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
                        // this.initDateModels(this.utcModel.epochTime);
                        // this._clockService.setClock(this.utcModel.epochTime);
                        this.aog.openAogDate = new TimeInstant(data.currentTimeLong, data.currentTime);
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

    get groupTypeList(): GroupTypes[] {
        return this._groupTypeList;
    }

    set groupTypeList(value: GroupTypes[]) {
        this._groupTypeList = value;
    }
}
