import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {DialogService} from '../../../../_services/dialog.service';
import {DataService} from '../../../../../shared/_services/data.service';
import {ApiRestService} from '../../../../../shared/_services/apiRest.service';
import {Subscription} from 'rxjs/Subscription';
import {Types} from '../../../../../shared/_models/configuration/types';
import {GroupTypes} from '../../../../../shared/_models/configuration/groupTypes';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StatusAog} from '../../../../../shared/_models/aog/statusAog';
import {StorageService} from '../../../../../shared/_services/storage.service';
import {Aog} from '../../../../../shared/_models/aog/aog';
import {Validation} from '../../../../../shared/_models/validation';
import {User} from '../../../../../shared/_models/user/user';
import {ActualTimeModel} from '../../../../../shared/_models/actualTime';
import {DetailsServiceAog} from '../../../../../details/_services/details_aog.service';
import {MessageService} from '../../../../../shared/_services/message.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {TranslationService} from '../../../../../shared/_services/translation.service';
import {RecoveryPlanInterface, RecoveryPlanService} from '../_services/recovery-plan.service';
import moment = require('moment');

@Component({
    selector: 'lsl-follow-up-aog-modal',
    templateUrl: './follow-up-aog-modal.component.html',
    styleUrls: ['./follow-up-aog-modal.component.scss']
})
export class FollowUpAogModalComponent implements OnInit, OnDestroy {

    public static FOLLOW_UP_CLOSED_STATUS = 'AOG.AOG_DETAILS.FOLLOW_UP.FOLLOW_UP_CLOSED_STATUS';
    public static FOLLOW_UP_LAST_STATUS = 'AOG.AOG_DETAILS.FOLLOW_UP.FOLLOW_UP_LAST_STATUS';
    public static FOLLOW_UP_DISABLED = 'AOG.AOG_DETAILS.FOLLOW_UP.FOLLOW_UP_DISABLED';
    public static FOLLOW_UP_SUCCESSFULLY = 'AOG.AOG_DETAILS.FOLLOW_UP.FOLLOW_UP_SUCCESSFULLY';

    private _configStatusAogSubscription: Subscription;
    private _aogSubcription: Subscription;
    private _followUpAog: StatusAog;

    private _currentUTCTime: number;
    private _followUpAogForm: FormGroup;

    private _user: User;
    private _selectedAog: Aog;
    private _statusCodes: Types[];

    private _durations: number[];
    private _validations: Validation;
    private _apiRestService: ApiRestService;
    private _delta: number;
    private _maxChars: number;

    private _follow_up_successfully: string;

    constructor(private _detailsService: DetailsServiceAog,
                private _messageService: MessageService,
                private _dialogService: DialogService,
                private _dataService: DataService,
                private http: HttpClient,
                private fb: FormBuilder,
                private _storageService: StorageService,
                @Inject(MAT_DIALOG_DATA) private _data: Aog,
                private _dialogRef: MatDialogRef<FollowUpAogModalComponent>,
                private _translationService: TranslationService,
                private _recoveryPlanService: RecoveryPlanService
    ) {

        this._followUpAog = StatusAog.getInstance();
        this._followUpAog.audit.username = this._storageService.getCurrentUser().username;
        this._apiRestService = new ApiRestService(http);

        this._currentUTCTime = 0;
        this._selectedAog = Aog.getInstance();
        this._validations = Validation.getInstance();

        this._user = this._storageService.getCurrentUser();

        this._statusCodes = [];

        this._maxChars = 400;
        this._selectedAog = _data;

        this._followUpAogForm = fb.group({
            'observation': [this.followUpAog.observation, Validators.required],
            'code': [this.followUpAog.code, Validators.required],
            'duration': [this.followUpAog.requestedInterval.duration, Validators.required]
        });
    }

    ngOnInit() {
        this._translationService.translate(FollowUpAogModalComponent.FOLLOW_UP_SUCCESSFULLY).then(res => this.follow_up_successfully = res);
        this.generateIntervalSelection();
        this.getStatusCodesAvailable();
        this.aogSubcription = this._detailsService.selectedAogChange.subscribe(aog => this.selectedAogChanged(aog));
        this.currentUTCTime = moment.utc().valueOf();
    }

    ngOnDestroy() {
        this.aogSubcription.unsubscribe();
        this.configStatusAogSubscription.unsubscribe();
    }

    /**
     * Open a cancel message if there is a filled item
     */
    public openCancelDialog(): void {
        this._dialogRef.close();
    }

    /**
     * Private method that use generic service to get available status codes for the selected aog,
     * also send a message to the service that show loading bar when the method is called and close it
     * when the result is completed (no matter if success or fail).
     *
     * @return {Types[]}
     *
     * @example
     * [{
     *  "code": "NI",
     *  "description": New Information

     *},
     *{
     *  "code": "ETR",
     *  "description": Extend Time Release

     *}]
     *
     */
    private getStatusCodesAvailable(): Types[] {
        this._dataService.stringMessage('open');
        this.configStatusAogSubscription = this.apiRestService
            .getSingle<GroupTypes>('configTypes', 'AOG_STATUS')
            .subscribe((data: GroupTypes) => {
                    this.statusCodes = data.types;
                    this.statusCodes.sort((a, b): number => {
                        if (a.code > b.code) { return -1; }
                        if (a.code < b.code) { return 1; }
                        return 0;
                    });
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
     * @param {StatusAog} statusCode - String code from safety event list
     *
     * @example
     * this.selectActiveCode("ETR");
     *
     * @return {void} nothing to return
     */
    public selectActiveCode(statusCode: StatusAog) {
        this.followUpAog.requestedInterval.duration = 30;
        this.followUpAogForm.get('duration').setValue(30);
        this.followUpAogForm.get('duration').updateValueAndValidity();

        this.followUpAog.code = statusCode.code;
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
     * Private service called everytime the aog selected from list change,
     * validate if aog is null because when the component initialize there's no aog yet.
     *
     * If aog is not null is assigned to a variable and the time interval is regenerated from the creation
     * date of aog instead of all 180 minutes, also the status codes available for the selected aog is called.
     *
     * @param {Aog} aog - Aog Model
     * @type {Aog}
     *
     * @return {void} nothing to return
     */
    private selectedAogChanged(aog: Aog): void {

        this.selectedAog = aog;
        // this.validations.isComponentDisabled = this.isComponentDisabled();

        this.getCurrentTime();
        this.getStatusCodesAvailable();
        this.generateIntervalSelection();

        this.followUpAog.aogId = this.selectedAog.id;
    }

    /**
     * Method to generate values for combo box where the time available for the follow up is showed,
     * in interval of 30 minutes, has an optional argument to generate the available time from the
     * creation date of the aog.
     *
     * If the equation has a value less than 0 or greater than 7 (the 180 minutes limit) the save
     * follow up button is set disabled.
     *
     * Difference between two values: 60 minutes then the array will have values from 30 to 120 minutes with intervals of 30 minutes between them.
     *
     * @return {void} nothing to return
     */
    private generateIntervalSelection(): void {
        let i: number;
        const quantity = 6;

        this.durations = [];

        for (i = 0; i < quantity; i++) {
            this.durations.push(i * 30 + 30);
        }

    }

    /**
     * Method to validate and submit the follow up information
     *
     * @param value
     *
     * @return {void} nothing to return
     */
    public submitForm(value: any) {

        this.followUpAog.aogId = this.selectedAog.id;
        console.log('Submit Aog', this.followUpAog);
        this.validations.isSubmited = true;

        if (this.followUpAogForm.valid) {
            this.validations.isSending = true;
            this._dataService.stringMessage('open');

            // const safetyCode = this.followUpForm.get('safetyEventCode').value;

            this.apiRestService
                .add<StatusAog>('followUpAog', this.followUpAog)
                .subscribe(() => {
                    this._dataService.stringMessage('reload');
                    this._messageService.openSnackBar(this.follow_up_successfully);
                    this.validations.isSubmited = false;
                    this.validations.isSending = false;
                    this._dialogRef.close();
                    this._followUpAogForm.reset();
                    this._recoveryPlanService.emitData();

                }, (err: HttpErrorResponse) => {
                    this._dataService.stringMessage('close');
                    this._messageService.openSnackBar(err.error.message);
                    this.validations.isSubmited = false;
                    this.validations.isSending = false;
                    this._dialogRef.close();
                });
        }
    }

    get apiRestService(): ApiRestService {
        return this._apiRestService;
    }

    set apiRestService(value: ApiRestService) {
        this._apiRestService = value;
    }


    get statusCodes(): Types[] {
        return this._statusCodes;
    }

    set statusCodes(value: Types[]) {
        this._statusCodes = value;
    }


    get followUpAogForm(): FormGroup {
        return this._followUpAogForm;
    }

    get followUpAog(): StatusAog {
        return this._followUpAog;
    }

    set followUpAog(value: StatusAog) {
        this._followUpAog = value;
    }

    get currentUTCTime(): number {
        return this._currentUTCTime;
    }

    set currentUTCTime(value: number) {
        this._currentUTCTime = value;
    }

    get user(): User {
        return this._user;
    }

    set user(value: User) {
        this._user = value;
    }

    get selectedAog(): Aog {
        return this._selectedAog;
    }

    set selectedAog(value: Aog) {
        this._selectedAog = value;
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

    get delta(): number {
        return this._delta;
    }

    set delta(value: number) {
        this._delta = value;
    }

    get maxChars(): number {
        return this._maxChars;
    }

    set maxChars(value: number) {
        this._maxChars = value;
    }

    get configStatusAogSubscription(): Subscription {
        return this._configStatusAogSubscription;
    }

    set configStatusAogSubscription(value: Subscription) {
        this._configStatusAogSubscription = value;
    }

    get aogSubcription(): Subscription {
        return this._aogSubcription;
    }

    set aogSubcription(value: Subscription) {
        this._aogSubcription = value;
    }


    get follow_up_successfully(): string {
        return this._follow_up_successfully;
    }

    set follow_up_successfully(value: string) {
        this._follow_up_successfully = value;
    }
}
