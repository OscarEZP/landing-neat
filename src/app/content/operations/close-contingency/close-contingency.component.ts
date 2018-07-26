import {Component, OnInit, Inject, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { DialogService } from '../../_services/dialog.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { StorageService } from '../../../shared/_services/storage.service';
import { ContingencyService } from '../../_services/contingency.service';
import { MessageService } from '../../../shared/_services/message.service';
import { DataService } from '../../../shared/_services/data.service';
import { CancelComponent } from '../cancel/cancel.component';
import { ApiRestService } from '../../../shared/_services/apiRest.service';
import {TranslationService} from '../../../shared/_services/translation.service';
import {Close} from '../../../shared/_models/close';
import {Subscription} from 'rxjs/Subscription';
import {Observable} from 'rxjs/Observable';
import {Location} from '../../../shared/_models/configuration/location';
import {User} from '../../../shared/_models/user/user';
import {map, startWith} from 'rxjs/operators';
import {GroupTypes} from '../../../shared/_models/configuration/groupTypes';
import {Aog} from '../../../shared/_models/aog/aog';
import {TimeInstant} from '../../../shared/_models/timeInstant';
import {Contingency} from '../../../shared/_models/contingency/contingency';

@Component({
    selector: 'lsl-close-contingency',
    templateUrl: './close-contingency.component.html',
    styleUrls: ['./close-contingency.component.scss']
})
export class CloseContingencyComponent implements OnInit, OnDestroy {

    private static AOG_ENDPOINT = 'aircraftOnGround';
    private static AOG_SUCCESS_MESSAGE = 'AOG.AOG_FORM.MESSAGE.SUCCESS';
    private static CONTINGENCY_TYPE = 'OPR';
    private static CLOSE_TYPE = 'CLOSE_TYPE';
    private static CLOSE_SUCCESS_MESSAGE = 'OPERATIONS.CLOSE_COMPONENT.CLOSE_SUCCESS';
    private static VALIDATION_ERROR_MESSAGE = 'OPERATIONS.VALIDATION_ERROR_MESSAGE';
    private static CANCEL_COMPONENT_MESSAGE = 'OPERATIONS.CANCEL_COMPONENT.MESSAGE';
    private static LOCATIONS_ENDPOINT = 'locations';
    private static TYPES_LIST_ENDPOINT = 'types';
    private static INTERVAL_DURATION = 30;
    private static INTERVAL_LIMIT = 1440;
    private static DEFAULT_DURATION = 60;

    private static MINUTE_ABBREVIATION = 'FORM.MINUTE_ABBREVIATION';
    private static HOUR_ABBREVIATION = 'FORM.HOUR_ABBREVIATION';
    private static HOUR_LABEL = 'FORM.HOUR';
    private static HOURS_LABEL = 'FORM.HOURS';

    private _aog: Aog;
    private _closeForm: FormGroup;
    private _aogForm: FormGroup;
    private _closeSignature: Close;
    private _locationList: Location[];
    private _typeCloseList: GroupTypes;
    private _groupTypeList: GroupTypes[];
    private _arrDuration: Array<number>;
    private _hourLabel: string;
    private _hoursLabel: string;
    private _minuteAbbreviation: string;
    private _hourAbbreviation: string;
    private _utcModel: TimeInstant;
    private _aogTypeCode: string;

    private _locationList$: Observable<Location[]>;

    private _locationSub: Subscription;
    private _groupTypesSub: Subscription;
    private _aogFormSub: Subscription;

    constructor(
        private _dialogService: DialogService,
        private _storageService: StorageService,
        private _contingencyService: ContingencyService,
        private _messageService: MessageService,
        private _dataService: DataService,
        private _apiRestService: ApiRestService,
        private _fb: FormBuilder,
        private _translationService: TranslationService,
        @Inject(MAT_DIALOG_DATA) public _data: Contingency
    ) {
        this._closeForm = _fb.group({
            'type': [null, Validators.required],
            'observation': [null, Validators.required]
        });

        this._aogForm = _fb.group({
            'station'   : [this.station, Validators.required],
            'barcode'   : [this.data.barcode, [Validators.pattern('^([a-zA-Z0-9])+'), Validators.maxLength(80)]],
            'reason'    : [this.data.reason, Validators.required],
            'duration'  : [CloseContingencyComponent.DEFAULT_DURATION, Validators.required],
            'tipology'  : ['', Validators.required]
        });

        this._utcModel = new TimeInstant(new Date().getTime(), null);
        this._closeSignature = new Close();
        this._typeCloseList = new GroupTypes();
        this._aog = Aog.getInstance();
        this._aogTypeCode = 'AOG';
    }

    ngOnInit() {
        this.aog.safety = this.data.safetyEvent.code;
        this.aog.maintenance = CloseContingencyComponent.CONTINGENCY_TYPE;
        this.aog.failure = this.data.failure;
        this.aog.fleet = this.data.aircraft.fleet;
        this.aog.tail = this.data.aircraft.tail;
        this.aog.operator = this.data.aircraft.operator;

        this.username = this._storageService.getCurrentUser().username;

        this.locationSub = this.getLocationSub();
        this.groupTypesSub = this.getGroupTypesSub();
        this.aogFormSub = this.getAogFormSubs();
        this.arrDuration = this.getDurationIntervals();
        this._translationService.translate(CloseContingencyComponent.MINUTE_ABBREVIATION).then(res => this.minuteAbbreviation = res);
        this._translationService.translate(CloseContingencyComponent.HOUR_ABBREVIATION).then(res => this.hourAbbreviation = res);
        this._translationService.translate(CloseContingencyComponent.HOURS_LABEL).then(res => this.hoursLabel = res);
        this._translationService.translate(CloseContingencyComponent.HOUR_LABEL).then(res => this.hourLabel = res);
    }

    ngOnDestroy() {
        this.locationSub.unsubscribe();
        this.groupTypesSub.unsubscribe();
        this.aogFormSub.unsubscribe();
    }

    /**
     * Subscription to get data from AOG form
     * @returns {Subscription}
     */
    private getAogFormSubs(): Subscription {
        return this.aogForm.valueChanges.subscribe(v => {
            this.aog.observation = this.closeForm.controls['observation'].value;
            this.aog.station = v.station;
            this.aog.barcode = v.barcode;
            this.aog.reason = v.reason;
            this.aog.durationAog = v.duration;
            this.aog.code = v.tipology;
        });
    }

    /**
     * Array with 30 minutes intervals
     * @returns {number[]}
     */
    private getDurationIntervals(): number[] {
        const res = [];
        for (let i = 1; i * CloseContingencyComponent.INTERVAL_DURATION <= CloseContingencyComponent.INTERVAL_LIMIT; i++) {
            res.push(i * CloseContingencyComponent.INTERVAL_DURATION);
        }
        return res;
    }

    /**
     * Get the location list from server
     * @return {Subscription}
     */
    private getLocationSub(): Subscription {
        return this._apiRestService
            .getAll<Location[]>(CloseContingencyComponent.LOCATIONS_ENDPOINT)
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
     * Get labels for duration intervals, example: 3h 00m
     * @param {number} duration
     * @returns {string}
     */
    public getDurationLabel(duration: number): string {
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
     * Filter for location observable list in view
     * @param {string} val
     * @return {Location[]}
     */
    private locationFilter(val: string): Location[] {
        return this.locationList.filter(location =>
            location.code.toLocaleLowerCase().search(val ? val.toLocaleLowerCase() : '') !== -1);
    }

    /**
     * Submit data process
     */
    public submitForm(): void {
        if (this.closeForm.valid) {
            this.postCloseContingency();
        } else {
            this._translationService.translateAndShow(CloseContingencyComponent.VALIDATION_ERROR_MESSAGE);
        }
    }

    /**
     * Promise to create an AOG
     * @returns {Promise<void>}
     */
    private postAog(): Promise<void> {
        return this._apiRestService
            .search(CloseContingencyComponent.AOG_ENDPOINT, this.aog)
            .toPromise()
            .then(() => {
                this._translationService.translateAndShow(CloseContingencyComponent.AOG_SUCCESS_MESSAGE);
                this._dataService.stringMessage('reload');
                this.dismissCloseContigency();
            }).catch(err => console.error(err));
    }

    /**
     * Promise to close a Contingency
     * @returns {Promise<void>}
     */
    private postCloseContingency(): Promise <void> {
        return this._contingencyService.closeContingency(this.closeSignature).toPromise()
            .then(() => {
                this._dataService.stringMessage('reload');
                if (this.closeForm.controls['type'].value === this.aogTypeCode) {
                    this.postAog();
                } else {
                    this._translationService.translateAndShow(CloseContingencyComponent.CLOSE_SUCCESS_MESSAGE);
                    this.dismissCloseContigency();
                }
            }, err => console.error(err));
    }

    /**
     * Get all group types
     * @return {Subscription}
     */
    private getGroupTypesSub(): Subscription {
        return this._apiRestService
            .getAll<GroupTypes[]>(CloseContingencyComponent.TYPES_LIST_ENDPOINT)
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
     * Get signature for close a Contingency
     * @returns {Close}
     */
    get closeSignature(): Close {
        return new Close(
            this._data.id,
            null,
            this.closeForm.controls['type'].value,
            this.closeForm.controls['observation'].value,
            this.user.userId
        );
    }

    /**
     * Open a cancel dialog if there is a change in form
     */
    public openCancelDialog(): void {
        if (!this.closeForm.pristine) {
            this._translationService.translate(CloseContingencyComponent.CANCEL_COMPONENT_MESSAGE)
                .then(res => this._messageService.openFromComponent(CancelComponent, {
                    data: {message: res},
                    horizontalPosition: 'center',
                    verticalPosition: 'top'
                }));
        } else {
            this.dismissCloseContigency();
        }
    }

    /**
     * Set an username in the AOG instance
     * @param {string} value
     */
    set username(value: string) {
        this.aog.username = value;
        this.aog.status.username = value;
    }

    /**
     * Close active dialogs
     */
    public dismissCloseContigency(): void {
        this._dialogService.closeAllDialogs();
    }

    get station(): string {
        return this.data.backup.location ? this.data.backup.location : this.data.flight.origin;
    }

    get user(): User  {
        return this._storageService.getCurrentUser();
    }

    get aogForm(): FormGroup {
        return this._aogForm;
    }

    set aogForm(value: FormGroup) {
        this._aogForm = value;
    }

    get closeForm(): FormGroup {
        return this._closeForm;
    }

    set closeForm(value: FormGroup) {
        this._closeForm = value;
    }

    get locationList$(): Observable<Location[]> {
        return this._locationList$;
    }

    set locationList$(value: Observable<Location[]>) {
        this._locationList$ = value;
    }

    get locationList(): Location[] {
        return this._locationList;
    }

    set locationList(value: Location[]) {
        this._locationList = value;
    }

    get aog(): Aog {
        return this._aog;
    }

    set aog(value: Aog) {
        this._aog = value;
    }

    get groupTypeList(): GroupTypes[] {
        return this._groupTypeList;
    }

    set groupTypeList(value: GroupTypes[]) {
        this._groupTypeList = value;
    }

    get data(): Contingency {
        return this._data;
    }

    set data(value: Contingency) {
        this._data = value;
    }

    get locationSub(): Subscription {
        return this._locationSub;
    }

    set locationSub(value: Subscription) {
        this._locationSub = value;
    }

    get groupTypesSub(): Subscription {
        return this._groupTypesSub;
    }

    set groupTypesSub(value: Subscription) {
        this._groupTypesSub = value;
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

    set hourLabel(value: string) {
        this._hourLabel = value;
    }

    set hoursLabel(value: string) {
        this._hoursLabel = value;
    }

    set minuteAbbreviation(value: string) {
        this._minuteAbbreviation = value;
    }

    set hourAbbreviation(value: string) {
        this._hourAbbreviation = value;
    }

    set arrDuration(value: Array<number>) {
        this._arrDuration = value;
    }

    get arrDuration(): Array<number> {
        return this._arrDuration;
    }

    get utcModel(): TimeInstant {
        return this._utcModel;
    }

    set utcModel(value: TimeInstant) {
        this._utcModel = value;
    }

    get aogTypeCode(): string {
        return this._aogTypeCode;
    }

    set aogTypeCode(value: string) {
        this._aogTypeCode = value;
    }

    get aogFormSub(): Subscription {
        return this._aogFormSub;
    }

    set aogFormSub(value: Subscription) {
        this._aogFormSub = value;
    }
}
