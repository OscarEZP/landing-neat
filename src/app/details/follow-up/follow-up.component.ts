import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ContingencyService } from '../../content/operations/_services/contingency.service';
import { ActualTimeModel } from '../../shared/_models/actualTime';
import { Aircraft } from '../../shared/_models/aircraft';
import { Backup } from '../../shared/_models/backup';
import { StatusCode } from '../../shared/_models/configuration/statusCode';
import { Contingency } from '../../shared/_models/contingency/contingency';
import { Flight } from '../../shared/_models/flight';
import { Interval } from '../../shared/_models/interval';
import { Safety } from '../../shared/_models/safety';
import { Status } from '../../shared/_models/status';
import { TimeInstant } from '../../shared/_models/timeInstant';
import { User } from '../../shared/_models/user/user';
import { Validation } from '../../shared/_models/validation';
import { ApiRestService } from '../../shared/_services/apiRest.service';
import { DataService } from '../../shared/_services/data.service';
import { MessageService } from '../../shared/_services/message.service';
import { StorageService } from '../../shared/_services/storage.service';
import { DetailsService } from '../_services/details.service';

/**
 * Follow up component
 * Allow to make follow ups for created contingencies when time from creation date is less than 180 minutes
 */
@Component({
    selector: 'lsl-follow-up',
    templateUrl: './follow-up.component.html',
    styleUrls: ['./follow-up.component.scss']
})
export class FollowUpComponent implements OnInit, OnDestroy {

    public static FOLLOW_UP_CLOSED_STATUS = 'OPERATIONS.CONTINGENCY_DETAILS.FOLLOW_UP.FOLLOW_UP_CLOSED_STATUS';
    public static FOLLOW_UP_LAST_STATUS = 'OPERATIONS.CONTINGENCY_DETAILS.FOLLOW_UP.FOLLOW_UP_LAST_STATUS';
    public static FOLLOW_UP_DISABLED = 'OPERATIONS.CONTINGENCY_DETAILS.FOLLOW_UP.FOLLOW_UP_DISABLED';

    @ViewChild('f') followUpFormChild;
    private _contingencySubcription: Subscription;
    private _detailServiceSubscription: Subscription;
    private _configStatusSubscription: Subscription;
    private _safetyEventListSubscription: Subscription;

    private _followUp: Status;

    private _currentUTCTime: number;
    private _followUpForm: FormGroup;
    private _safetyEventList: Safety[];
    private _user: User;
    private _selectedContingency: Contingency;
    private _statusCodes: StatusCode[];

    private _durations: number[];
    private _validations: Validation;
    private _apiRestService: ApiRestService;
    private _delta: number;

    /**
     * @param {DetailsService} _detailsService - Shared service of the detail sidebar
     * @param {MessageService} _messageService - Shared service to call loading and other services
     * @param {FormBuilder} fb - Form builder creator to validate and init the form
     * @param {StorageService} _storageService - Service to retrieve and save data in local storage
     * @param {DataService} _dataService - Service to transport data message between components subscribed
     * @param {HttpClient} http Generic service to communicate with API
     */
    constructor(
        private _detailsService: DetailsService,
        private _messageService: MessageService,
        private fb: FormBuilder,
        private _storageService: StorageService,
        private _dataService: DataService,
        private http: HttpClient) {
        this.followUp = new Status(null, null, null, new TimeInstant(null, null), null, new Interval(new TimeInstant(null, null), null), new Interval(new TimeInstant(null, null), null), this._storageService.getCurrentUser().userId);

        this.apiRestService = new ApiRestService(http);

        this.currentUTCTime = 0;
        this.selectedContingency = new Contingency(null, new Aircraft(null, null, null), null, new TimeInstant(null, null), null, new Flight(null, null, null, new TimeInstant(null, null)), null, false, false, new Backup(null, new TimeInstant(null, null)), null, new Safety(null, null), new Status(null, null, null, new TimeInstant(null, null), null, new Interval(null, null), new Interval(null, null), null), null, null, 0);

        this.validations = new Validation(false, true, true, false);

        this.user = this._storageService.getCurrentUser();

        this.statusCodes = [];

        this.followUpForm = fb.group({
            'safety': [false],
            'safetyEventCode': [null],
            'observation': [this.followUp.observation, Validators.required],
            'code': [this.followUp.code, Validators.required],
            'duration': [this.followUp.requestedInterval.duration, Validators.required]
        });
    }

    /**
     * When the component initialize the current UTC time service is called,
     * safetyEventList is called to allow add in follow up if wasn't added in contingency creation,
     * generateIntervalSelection is called to generate a list of minutes for combo box.
     * User is obtained from local storage
     * and last but not least two subscriptions are added:
     * 1 - Current selected contingency to obtain changes in contingency selected from list
     * 2 - Safety event message to obtain from service if the contingency selected from list has or hasn't a safety event
     *
     * @return {void} nothing to return
     */
    ngOnInit() {

        this.generateIntervalSelection();
        this._safetyEventListSubscription = this.getSafetyEventList();
        this.getStatusCodesAvailable();

        this.contingencySubcription = this._detailsService.selectedContingencyChange.subscribe(contingency => this.selectedContingencyChanged(contingency));
        this.detailServiceSubscription = this._detailsService.sidenavVisibilityChange.subscribe(message => this.isDetailVisibleChange(message));
    }

    /**
     * Called when the component is destroyed to unsubscribe
     *
     * @return {void} nothing to return
     */
    ngOnDestroy() {
        this.contingencySubcription.unsubscribe();
        this.detailServiceSubscription.unsubscribe();
        this._configStatusSubscription.unsubscribe();
        this._safetyEventListSubscription.unsubscribe();
    }

    /**
     * Private service called everytime the contingency selected from list change,
     * validate if contingency is null because when the component initialize there's no contingency yet.
     *
     * If contingency is not null is assigned to a variable and the time interval is regenerated from the creation
     * date of contingency instead of all 180 minutes, also the status codes available for the selected contingency is called.
     *
     * @param {Contingency} contingency - Contingency Model
     * @type {Contingency}
     *
     * @return {void} nothing to return
     */
    private selectedContingencyChanged(contingency: Contingency): void {
        this.selectedContingency = contingency;
        this.disabledComponent();

        this.getCurrentTime();
        this.getStatusCodesAvailable();
        this.generateIntervalSelection(this.selectedContingency.creationDate.epochTime);

        this.followUp.contingencyId = this.selectedContingency.id;
    }

    /**
     * Method called everytime the subscripted boolean change is value, but only apply when is false
     * @param {boolean} isVisible
     */
    private isDetailVisibleChange(isVisible: boolean): void {
        if (!isVisible) {
            this.validations.isSubmited = false;
            this.followUpForm.get('safety').setValue(false);
            this.followUpForm.get('safety').updateValueAndValidity();
            this.onSelectOptional(isVisible);
            this.followUpForm.reset();

            if (this.followUpFormChild !== undefined) {
                this.followUpFormChild.resetForm();
            }
        }
    }

    /**
     * Method to generate values for combo box where the time available for the follow up is showed,
     * in interval of 5 minutes, has an optional argument to generate the available time from the
     * creation date of the contingency.
     *
     * If the equation has a value less than 0 or greater than 37 (the 180 minutes limit) the save
     * follow up button is set disabled.
     *
     * @todo
     * Get the time limit from a config service instead of use hard value of 180.
     *
     * @param {number} creationDate - Creation date value is in epoch time milliseconds
     * @example
     * this.generateIntervalSelection(1513900719000)
     * currentTime = 1513904314000
     *
     * Difference between two values: 60 minutes then the array will have values from 5 to 120 minutes with intervals of 5 minutes between them.
     *
     * @return {void} nothing to return
     */
    private generateIntervalSelection(creationDate?: number): void {
        let i: number;
        let quantity = 36;
        this.apiRestService.getAll<ActualTimeModel>('dateTime')
            .subscribe(response => this.currentUTCTime = response.currentTimeLong)
            .add(() => {
                this.durations = [];
                if (creationDate) {
                    quantity = Math.ceil(((creationDate + (180 * 60000)) - this.currentUTCTime) / (60000 * 5));
                }

                if (0 < quantity && quantity < 37) {
                    for (i = 0; i < quantity; i++) {
                        this.durations.push(i * 5 + 5);
                    }
                }
            });
    }

    /**
     * Private method that use generic service to get available status codes for the selected contingency,
     * also send a message to the service that show loading bar when the method is called and close it
     * when the result is completed (no matter if success or fail).
     *
     * @return {StatusCode[]}
     *
     * @example
     * [{
     *  "code": "NI4",
     *  "description": null,
     *  "level": 4,
     *  "isActive": "Y",
     *  "defaultTime": 60
     *},
     *{
     *  "code": "ETR",
     *  "description": null,
     *  "level": null,
     *  "isActive": "Y",
     *  "defaultTime": 60
     *}]
     *
     */
    private getStatusCodesAvailable(): StatusCode[] {
        this._dataService.stringMessage('open');
        this._configStatusSubscription = this.apiRestService
            .getSingle('configStatus', this.selectedContingency.status.code)
            .subscribe((data: StatusCode[]) => {
                    this.statusCodes = data;
                    this.disabledComponent();
                },
                error => () => {
                    this._dataService.stringMessage('close');
                }, () => {
                    this._dataService.stringMessage('close');
                });

        return this.statusCodes;
    }

    /**
     * Public method called when a status code is selected in the view and select the default value of time
     * defined for the status.
     *
     * @param {StatusCode} statusCode - String code from safety event list
     *
     * @example
     * this.selectActiveCode("FT3");
     *
     * @return {void} nothing to return
     */
    public selectActiveCode(statusCode: StatusCode) {
        this.followUp.requestedInterval.duration = statusCode.defaultTime;
        this.followUpForm.get('duration').setValue(statusCode.defaultTime);
        this.followUpForm.get('duration').updateValueAndValidity();

        this.followUp.code = statusCode.code;
        this.followUp.level = statusCode.level;
    }

    /**
     * Method to get current time from service, is called in the initialization of the component and everytime one value of the combo box is selected to calculate real remaining time.
     *
     * @return {void} nothing to return
     */
    public getCurrentTime(): Subscription {
        this._dataService.stringMessage('open');
        return this.apiRestService
            .getAll('dateTime')
            .subscribe((data: ActualTimeModel) => {
                this.currentUTCTime = data.currentTimeLong;

                this.setActualDelta();
            },
                    error => () => {
                        this._dataService.stringMessage('close');
                    },
                    () => {
                        this._dataService.stringMessage('close');
                    }
            );
    }

    /**
     * Method to calculate the delta time remaining between the selected time in combo box and the real remaining time
     * (180 minutes rule), set the delta to a variable and set the warning if the time selected is greater than
     * the real remaining.
     *
     * @param {number} currentTimeLong
     *
     * @return {void} nothing to return
     */
    private setActualDelta(): number {

        this.delta = -1;

        if (this.selectedContingency.creationDate.epochTime !== null) {
            this.delta = Math.round(((this.selectedContingency.creationDate.epochTime + 180 * 60 * 1000) - this.currentUTCTime) / 60000);
        }

        return this.delta;
    }

    /**
     * Method to obtain the safety event list and populate a combo box.
     */
    public getSafetyEventList(): Subscription {
        this._dataService.stringMessage('open');
        return this.apiRestService
            .getAll<Safety[]>('safetyEvent')
            .subscribe(data => this.safetyEventList = data,
                error => () => {
                    this._dataService.stringMessage('close');
                    this._messageService.openSnackBar(error.message);
                },
                () => {
                    this._dataService.stringMessage('close');
                });
    }

    /**
     * Method to call detail service and close the sidenav
     *
     * @return {void} nothing to return
     */
    public closeDetails() {
        this._detailsService.closeSidenav();
    }

    /**
     * Method to validate and submit the follow up information
     *
     * @param value
     *
     * @return {void} nothing to return
     */
    public submitForm(value: any) {

        this.validations.isSubmited = true;

        if (this.followUpForm.valid) {
            this.validations.isSending = true;
            this._dataService.stringMessage('open');

            const safetyCode = this.followUpForm.get('safetyEventCode').value;

            this.apiRestService
                .add<Status>('followUp', this.followUp, safetyCode)
                .subscribe(() => {
                    this._detailsService.closeSidenav();
                    this._dataService.stringMessage('reload');
                    this._messageService.openSnackBar('created');
                    this._dataService.stringMessage('close');
                    this.validations.isSubmited = false;
                    this.validations.isSending = false;
                    this._followUpForm.reset();

                }, (err: HttpErrorResponse) => {
                    this._dataService.stringMessage('close');
                    this._messageService.openSnackBar(err.error.message);
                    this.validations.isSubmited = false;
                    this.validations.isSending = false;
                });
        }
    }

    /**
     * Method to change the validation of form when the safety event checkbox is selected or unselected
     *
     * @return {void} nothing to return
     */
    public onSelectOptional(checkValue: boolean) {
        const safetyEventCodeFormInput = this.followUpForm.get('safetyEventCode');

        safetyEventCodeFormInput.setValidators(checkValue ? Validators.required : null);
        safetyEventCodeFormInput.setValue(checkValue ? safetyEventCodeFormInput.value : null);
        safetyEventCodeFormInput.updateValueAndValidity();
    }

    /**
     * Private method to disable form view if any of the conditions are fulfilled
     * @return {boolean}
     */
    private disabledComponent(): boolean {
        let isComponentDisabled = false;

        if (this.selectedContingency.isClose || this.selectedContingency.status.level === null || this.delta <= 0 || this.statusCodes.length === 0) {
            isComponentDisabled = true;
        }

        return this.validations.isComponentDisabled = isComponentDisabled;
    }

    /**
     * Public method to get the disabled message when one the conditions are meet in priority order
     * @return {string}
     */
    public disabledMensage(): string {
        if (this.selectedContingency.isClose) {
            return FollowUpComponent.FOLLOW_UP_CLOSED_STATUS;
        } else if (this.selectedContingency.status.level === null || this.statusCodes.length === 0) {
            return FollowUpComponent.FOLLOW_UP_LAST_STATUS;
        } else if (this.delta <= 0) {
            return FollowUpComponent.FOLLOW_UP_DISABLED;
        }

        return null;
    }

    get contingencySubcription(): Subscription {
        return this._contingencySubcription;
    }

    set contingencySubcription(value: Subscription) {
        this._contingencySubcription = value;
    }

    get detailServiceSubscription(): Subscription {
        return this._detailServiceSubscription;
    }

    set detailServiceSubscription(value: Subscription) {
        this._detailServiceSubscription = value;
    }

    get followUp(): Status {
        return this._followUp;
    }

    set followUp(value: Status) {
        this._followUp = value;
    }

    get currentUTCTime(): number {
        return this._currentUTCTime;
    }

    set currentUTCTime(value: number) {
        this._currentUTCTime = value;
    }

    get followUpForm(): FormGroup {
        return this._followUpForm;
    }

    set followUpForm(value: FormGroup) {
        this._followUpForm = value;
    }

    get safetyEventList(): Safety[] {
        return this._safetyEventList;
    }

    set safetyEventList(value: Safety[]) {
        this._safetyEventList = value;
    }

    get user(): User {
        return this._user;
    }

    set user(value: User) {
        this._user = value;
    }

    get selectedContingency(): Contingency {
        return this._selectedContingency;
    }

    set selectedContingency(value: Contingency) {
        this._selectedContingency = value;
    }

    get statusCodes(): StatusCode[] {
        return this._statusCodes;
    }

    set statusCodes(value: StatusCode[]) {
        this._statusCodes = value;
    }

    get durations(): number[] {
        return this._durations;
    }

    set durations(value: number[]) {
        this._durations = value;
    }

    get validations(): Validation {
        return this._validations;
    }

    set validations(value: Validation) {
        this._validations = value;
    }

    get apiRestService(): ApiRestService {
        return this._apiRestService;
    }

    set apiRestService(value: ApiRestService) {
        this._apiRestService = value;
    }

    get delta(): number {
        return this._delta;
    }

    set delta(value: number) {
        this._delta = value;
    }

}
