import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DialogService} from '../../_services/dialog.service';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TimeInstant} from '../../../shared/_models/timeInstant';
import {Contingency} from '../../../shared/_models/contingency/contingency';
import {ClockService} from '../../../shared/_services/clock.service';
import {TimerObservable} from 'rxjs/observable/TimerObservable';
import {DatetimeService} from '../../../shared/_services/datetime.service';
import {DataService} from '../../../shared/_services/data.service';
import {MAT_DIALOG_DATA} from '@angular/material';
import {ApiRestService} from '../../../shared/_services/apiRest.service';
import {GroupTypes} from '../../../shared/_models/configuration/groupTypes';
import {Types} from '../../../shared/_models/configuration/types';
import {Validation} from '../../../shared/_models/validation';
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from '../../../shared/_services/message.service';
import {CancelComponent} from '../cancel/cancel.component';
import {Activity} from '../../../shared/_models/meeting/activity';
import {Assistant} from '../../../shared/_models/meeting/assistant';
import {Meeting} from '../../../shared/_models/meeting/meeting';
import {Mail} from '../../../shared/_models/configuration/mail';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import {Subscription} from 'rxjs/Subscription';
import {StorageService} from '../../../shared/_services/storage.service';
import {Agreement} from '../../../shared/_models/meeting/agreement';
import {Pending} from '../../../shared/_models/meeting/pending';

@Component({
    selector: 'lsl-meeting-form',
    templateUrl: './meeting.component.html',
    styleUrls: ['./meeting.component.scss']
})

export class MeetingComponent implements OnInit, OnDestroy {

    private static MEETINGS_ENDPOINT = 'meetings';
    private static MAILS_ENDPOINT = 'mails';
    private static AREAS_ENDPOINT = 'areas';
    private static MOC_CODE = 'MOC';

    private static MEETINGS_CONFIG_TYPE = 'MEETING_ACTIVITIES';
    private static BARCODE_PATTERN = '^[a-zA-Z0-9]+\\S$';

    private _meetingSubscription: Subscription;
    private _emailsSubscription: Subscription;
    private _meetingActivitiesSubscription: Subscription;
    private _emailsConfSubscription: Subscription;
    private _areasSubscription: Subscription;

    private _meetingForm: FormGroup;
    private _assistantForm: FormGroup;
    private _agreementForm: FormGroup;
    private _pendingForm: FormGroup;

    private _utcModel: TimeInstant;
    private _timeClock: Date;
    private _interval: number;
    private _alive: boolean;
    private _meetingActivitiesConf: Types[];
    private _validations: Validation;
    private _snackbarMessage: string;
    private _assistant: Assistant;
    private _pending: Pending;
    private _mails: string[];
    private _filteredOptions: Observable<string[]>;
    private _filteredAreas: Observable<string[]>;

    private _meeting: Meeting;
    private _agreement: string;
    private _areas: string[];
    private _pendingsGroups: any[];
    private _maxChars: number;

    static emailValidator(control: FormControl) {
        if (!control.value.match(/^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i) && control.value) {
            return {invalidEmail: true};
        } else {
            return null;
        }
    }

    constructor(private _dialogService: DialogService,
                private _fb: FormBuilder,
                private _clockService: ClockService,
                private _datetimeService: DatetimeService,
                private _messageData: DataService,
                private _messageService: MessageService,
                private _apiRestService: ApiRestService,
                @Inject(MAT_DIALOG_DATA) private _contingency: Contingency,
                private _translate: TranslateService,
                private _storageService: StorageService) {
        this._interval = 1000 * 60;
        this._alive = true;
        const initFakeDate = new Date().getTime();
        this.mails = [];
        this.areas = [];
        this.pendingsGroups = [];

        const username = this._storageService.getCurrentUser().username;
        this.meeting = new Meeting(this.contingency.id);
        this.assistant = new Assistant('');
        this.pending = Pending.getInstance();

        this.meeting.createUser = username;
        this.pending.createUser = username;

        this.utcModel = new TimeInstant(initFakeDate, null);
        this.meetingForm = this.getFormValidators();
        this.pendingForm = this.getPendingForm();
        this.assistantForm = this.getAssistantForm();
        this.agreementForm = this._fb.group({agreement: [this.agreement]});

        this.barcode = this.contingency.barcode;
        this.safetyCode = this.contingency.safetyEvent.code;
        this.mails = [];

        this._emailsConfSubscription = this.getMailsConf();
        this._meetingActivitiesSubscription = this.setMeetingActivitiesConf();
        this._areasSubscription = this.getAreas();

        this.validations = Validation.getInstance();

        this.agreement = '';
        this._maxChars = 400;
    }

    ngOnInit(): void {
        TimerObservable.create(0, this._interval)
            .subscribe(() => {
                this._datetimeService.getTime()
                    .subscribe((data) => {
                        this.utcModel = new TimeInstant(data.currentTimeLong, data.currentTime);
                        this.newMessage();
                        this._clockService.setClock(this.utcModel.epochTime);
                    });
            });
        this._clockService.getClock().subscribe(time => this.timeClock = time);
        this.filteredOptions = this.getFilteredOptions();
        this.filteredAreas = this.getFilteredAreas();
    }

    ngOnDestroy() {
        this._meetingActivitiesSubscription.unsubscribe();
        this._areasSubscription.unsubscribe();
        if (this._meetingSubscription) {
            this._meetingSubscription.unsubscribe();
        }
        if (this._emailsSubscription) {
            this._emailsSubscription.unsubscribe();
        }
    }

    /**
     * Filter for area list
     * @return {Observable<string[]>}
     */
    private getFilteredAreas(): Observable <string[]> {
        return this.pendingForm.controls['area'].valueChanges
        .pipe(
            startWith(''),
            map(val => {
                const result = this.filter(val, this.areas);
                return result.length > 0 ? result : this.areas;
            })
        );
    }

    /**
     * Filter for mail list
     * @return {Observable<string[]>}
     */
    private getFilteredOptions(): Observable <string[]> {
        return this.assistantForm.controls['assistantMail'].valueChanges
        .pipe(
            startWith(''),
            map(val => {
                if (val.length >= 3) {
                    return this.filter(val, this.mails);
                }
            })
        );
    }

    /**
     * Validation for selecting values only from options
     * @param val
     * @param list
     * @return {string}
     */
    public comboValidation(val: string, list: string[]): string {
        return val && list.filter(v => (v.toLowerCase() === val.toLowerCase() || v.toLowerCase().indexOf(val.toLowerCase()) !== -1)).length > 0 ? val : '';
    }

    /**
     * Method for regroup pending list items
     */
    private reloadPendings(): Pending[] {
        return this.groupBy(this.meeting.pendings, 'area');
    }

    /**
     * Validation for pending form
     * @return {boolean}
     */
    private pendingValidation(): boolean {
        let valid = true;
        const errorObj = { descriptionRequired: false, areaRequired: false };
        if (this.pending.area === null || this.pending.area === '') {
            valid = false;
            errorObj.areaRequired = true;
        }
        if (this.pending.description === null || this.pending.description === '') {
            valid = false;
            errorObj.descriptionRequired = true;
        }
        this.pendingForm.setErrors(errorObj);
        return valid;
    }

    /**
     * Add pending method
     */
    public addPending(): boolean {
        let result = false;
        if (this.pendingForm.valid && this.pendingValidation()) {
            this.meeting.pendings.push(new Pending(this.pending.area, this.pending.description, this.pending.createUser));
            this.pendingsGroups = this.reloadPendings();
            this.pending.description = '';
            this.pending.area = '';
            result = true;
        }
        return result;
    }

    /**
     * Delete pending from list
     * @param pending
     */
    public deletePending(pending: Pending): void {
        this.meeting.pendings = this.meeting.pendings.filter(p => pending !== p);
        this.pendingsGroups = this.reloadPendings();
    }

    /**
     * Group a collection by attribute
     * @param collection
     * @param property
     * @return {Array}
     */
    private groupBy(collection: any[], property: string) {
        let i = 0, val, index;
        const values = [], result = [];
        for (; i < collection.length; i++) {
            val = collection[i][property];
            index = values.indexOf(val);
            if (index > -1) {
                result[index].push(collection[i]);
            } else {
                values.push(val);
                result.push([collection[i]]);
            }
        }
        return result;
    }

    /**
     * Get areas for add pending
     */
    private getAreas(): Subscription {
        return this._apiRestService
        .getAll<any[]>(MeetingComponent.AREAS_ENDPOINT)
        .subscribe(rs => {
            rs.forEach(area => this.areas.push(area.description));
        });
    }

    /**
     * Get pending form with validation
     * @return {FormGroup}
     */
    private getPendingForm(): FormGroup {
        return this._fb.group({
            area: [''],
            description: ['']
        });
    }

    /**
     * Get assistant form with validation
     * @return {FormGroup}
     */
    private getAssistantForm(): FormGroup {
        return this._fb.group({
            assistantMail: [this.assistant.mail, {validators: MeetingComponent.emailValidator}],
            mailSelected: new FormControl()
        });
    }

    /**
     * Filter for coincidencies
     * @param val
     * @return {string[]}
     */
    public filter(val: string, list: any[]): string[] {
        return list.filter(option =>
            option.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }

    /**
     * Get form with validators
     * @return {FormGroup}
     */
    private getFormValidators(): FormGroup {
        this.meetingForm = this._fb.group({
            meetingAsistants: ['', Validators.required],
            performedActivities: [this.performedActivities, Validators.required],
        });
        const barcodeValidators = [Validators.pattern(MeetingComponent.BARCODE_PATTERN), Validators.maxLength(80)];
        if (this.safetyCode !== null) {
            barcodeValidators.push(Validators.required);
        }
        this.meetingForm.addControl('barcode', new FormControl(this.barcode, barcodeValidators));
        return this.meetingForm;
    }

    /**
     * Get configuration for meeting activities
     */
    private setMeetingActivitiesConf(): Subscription {
        return this._apiRestService.getSingle('configTypes', MeetingComponent.MEETINGS_CONFIG_TYPE).subscribe(rs => {
            const res = rs as GroupTypes;
            this.meetingActivitiesConf = res.types;
            this.meetingActivities = MeetingComponent.setMeetingActivities(this.meetingActivitiesConf);
        });
    }

    /**
     * Get meeting activities by meeting activities configuration
     * @param meetingActivitiesConf
     * @return {Activity[]}
     */
    private static setMeetingActivities(meetingActivitiesConf: Types[]): Activity[] {
        const meetingActivities: Activity[] = [];
        for (const activityConf of meetingActivitiesConf) {
            meetingActivities.push(new Activity(activityConf.code, false, false));
        }
        return meetingActivities;
    }

    /**
     * Method for add pending if there is an activity without done check
     * @param meeting
     * @return {Meeting}
     */
    private addPendingsByActivities(meeting: Meeting): Meeting {
        meeting.activities.forEach((act) => {
            if (act.apply && !act.done && meeting.pendings.filter((p) => p.area === MeetingComponent.MOC_CODE && p.description === act.code).length < 1) {
                meeting.pendings.push(new Pending(MeetingComponent.MOC_CODE, act.code, this.pending.createUser));
            }
        });
        return meeting;
    }

    /**
     * Save meeting form
     */
    public submitForm() {
        if (this.meetingForm.valid) {
            this.meeting = this.addPendingsByActivities(this.meeting);
            this.validations.isSending = true;
            let res: Response;
            this._meetingSubscription = this._apiRestService
                .add<Response>(MeetingComponent.MEETINGS_ENDPOINT, this.meeting)
                .subscribe(response => res = response,
                    err => {
                        this.getTranslateString('OPERATIONS.MEETING_FORM.FAILURE_MESSAGE');
                        const message: string = err.error.message !== null ? err.error.message : this.snackbarMessage;
                        this._messageService.openSnackBar(message);
                        this.validations.isSending = false;
                    }, () => {
                        this._emailsSubscription = this.saveEmails();
                    }
                );
        } else {
            this.getTranslateString('OPERATIONS.VALIDATION_ERROR_MESSAGE');
            this._messageService.openSnackBar(this.snackbarMessage);
            this.validations.isSending = false;
        }
    }

    /**
     * Method for save email in configuration table
     * @return {Subscription}
     */
    public saveEmails(): Subscription {
        let res: Response;
        const signatureAssistantConf = this.getSignatureAssistantConf();

        return this._apiRestService
            .add<Response>(MeetingComponent.MAILS_ENDPOINT, signatureAssistantConf)
            .subscribe(
                response => res = response,
                err => {
                    this.getTranslateString('OPERATIONS.MEETING_FORM.FAILURE_MESSAGE');
                    const message: string = err.error.message !== null ? err.error.message : this.snackbarMessage;
                    this._messageService.openSnackBar(message);
                    this.validations.isSending = false;
                },
                () => {
                    this.getTranslateString('OPERATIONS.MEETING_FORM.SUCCESSFULLY_MESSAGE');
                    this._messageService.openSnackBar(this.snackbarMessage);
                    this._dialogService.closeAllDialogs();
                    this._messageData.stringMessage('reload');
                    this.validations.isSending = false;
                }
            );
    }

    /**
     * Add email to list and clean text input
     */
    public addAssistant(): void {
        if (this.assistantForm.valid && this.assistant.mail !== '') {
            const currentAssistant = new Assistant(this.assistant.mail);
            const findAssistant = this.meetingAssistants.find(x => x.mail === currentAssistant.mail);
            if (typeof findAssistant === 'undefined') {
                this.meetingAssistants.push(currentAssistant);
                this.meetingForm.controls['meetingAsistants'].setValue(this.meetingAssistants);
                this.assistant.mail = '';
            }
        }
    }

    /**
     * Add agreement to list and clean text input
     */
    public addAgreement(): void {
        if (this.agreementForm.valid && this.agreement !== '') {
            const currentAgreement = new Agreement();
            currentAgreement.description = this.agreement;

            currentAgreement.createUser = this._storageService.getCurrentUser().username;
            const findAgreement = this.meetingAgreements.find(x => x.description === currentAgreement.description);
            if (typeof findAgreement === 'undefined') {
                this.meetingAgreements.push(currentAgreement);

                this.agreement = '';
            }
        }
    }

    /**
     * Delete Assistant Meeting from assistant list
     */
    deleteAssistantMeeting(index: number) {
        if (index !== -1) {
            this.meetingAssistants.splice(index, 1);
        }
    }
    /**
     * Delete Agreement Meeting from assistant list
     */
    deleteAgreementMeeting(index: number) {
        if (index !== -1) {
            this.meetingAgreements.splice(index, 1);
        }
    }


    /**
     * Get a emails list for add assistant
     */
    private getMailsConf(): Subscription {
        return this._apiRestService
            .getAll<Mail[]>(MeetingComponent.MAILS_ENDPOINT)
            .subscribe(rs => {
                rs.forEach(mail => this.mails.push(mail.address));
            });
    }

    /**
     * Get a Mail Object to sending data
     * @return {Meeting}
     */
    private getSignatureAssistantConf(): Mail[] {
        const mailsConf: Mail[] = [];
        const assistants = this.meetingAssistants;
        assistants.forEach(assistant => {
            const mail = new Mail(assistant.mail);
            mailsConf.push(mail);
        });
        return mailsConf;
    }

    /**
     * Get a translated message by code
     * @param toTranslate
     */
    private getTranslateString(toTranslate: string) {
        this._translate.get(toTranslate).subscribe((res: string) => {
            this.snackbarMessage = res;
        });
    }

    /**
     * Trigger for change time
     */
    private newMessage(): void {
        this._messageData.changeTimeUTCMessage(this.utcModel.epochTime);
    }

    /**
     * Close form modal
     */
    public closeDialog(): void {
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
     * Method to validate items touched by user
     * @return {boolean}
     */
    private validateFilledItems(): boolean {
        let counterPristine = 0;
        let counterItems = 0;
        Object.keys(this.meetingForm.controls).forEach(elem => {
            counterItems += 1;
            if (this.meetingForm.controls[elem].pristine) {
                counterPristine += 1;
            }
        });
        const activities = this.meetingActivities.filter(act => act.apply);
        return (counterPristine < counterItems) || (activities.length > 0);
    }

    /**
     * Change checkbox value to false if apply slider is false
     * @param meetingActivity
     */
    public checkApply(meetingActivity: Activity) {
        meetingActivity.done = !meetingActivity.apply ? false : meetingActivity.done;
        this.meetingActivities.forEach((elem, i) => {
            if (meetingActivity.code === elem['code']) {
                this.meetingActivities[i] = meetingActivity;
            }
        });
    }

    get timeClock(): Date {
        return this._timeClock;
    }

    set timeClock(value: Date) {
        this._timeClock = value;
    }

    get contingency(): Contingency {
        return this._contingency;
    }

    set contingency(value: Contingency) {
        this._contingency = value;
    }

    get utcModel(): TimeInstant {
        return this._utcModel;
    }

    set utcModel(value: TimeInstant) {
        this._utcModel = value;
    }

    get meetingForm(): FormGroup {
        return this._meetingForm;
    }

    set meetingForm(value: FormGroup) {
        this._meetingForm = value;
    }

    get meetingActivitiesConf(): Types[] {
        return this._meetingActivitiesConf;
    }

    set meetingActivitiesConf(value: Types[]) {
        this._meetingActivitiesConf = value;
    }

    get meetingActivities(): Activity[] {
        return this.meeting.activities;
    }

    set meetingActivities(value: Activity[]) {
        this.meeting.activities = value;
    }

    get validations(): Validation {
        return this._validations;
    }

    set validations(value: Validation) {
        this._validations = value;
    }

    get snackbarMessage(): string {
        return this._snackbarMessage;
    }

    set snackbarMessage(value: string) {
        this._snackbarMessage = value;
    }

    get meetingAssistants(): Assistant[] {
        return this.meeting.assistants;
    }

    set meetingAssistants(value: Assistant[]) {
        this.meeting.assistants = value;
    }

    get meetingAgreements(): Agreement[] {
        return this.meeting.agreements;
    }

    set meetingAagreements(value: Agreement[]) {
        this.meeting.agreements = value;
    }


    get assistant(): Assistant {
        return this._assistant;
    }

    set assistant(value: Assistant) {
        this._assistant = value;
    }


    get assistantForm(): FormGroup {
        return this._assistantForm;
    }


    set assistantForm(value: FormGroup) {
        this._assistantForm = value;
    }


    get mails(): string[] {
        return this._mails;
    }


    set mails(value: string[]) {
        this._mails = value;
    }

    get barcode(): string {
        return this.meeting.barcode;
    }

    set barcode(value: string) {
        this.meeting.barcode = value;
    }

    get safetyCode(): string {
        return this.meeting.safetyCode;
    }

    set safetyCode(value: string) {
        this.meeting.safetyCode = value;
    }

    get meeting(): Meeting {
        return this._meeting;
    }

    set meeting(value: Meeting) {
        this._meeting = value;
    }

    get areas(): string[] {
        return this._areas;
    }

    set areas(value: string[]) {
        this._areas = value;
    }

    get pendingForm(): FormGroup {
        return this._pendingForm;
    }

    set pendingForm(value: FormGroup) {
        this._pendingForm = value;
    }

    get pending(): Pending {
        return this._pending;
    }

    set pending(value: Pending) {
        this._pending = value;
    }

    get filteredAreas(): Observable<string[]> {
        return this._filteredAreas;
    }

    set filteredAreas(value: Observable<string[]>) {
        this._filteredAreas = value;
    }

    get filteredOptions(): Observable<string[]> {
        return this._filteredOptions;
    }

    set filteredOptions(value: Observable<string[]>) {
        this._filteredOptions = value;
    }

    get pendingsGroups(): any[] {
        return this._pendingsGroups;
    }

    set pendingsGroups(value: any[]) {
        this._pendingsGroups = value;
    }

    get agreement(): string {
        return this._agreement;
    }

    set agreement(value: string) {
        this._agreement = value;
    }


    get agreementForm(): FormGroup {
        return this._agreementForm;
    }

    set agreementForm(value: FormGroup) {
        this._agreementForm = value;
    }

    get performedActivities(): string {
        return this.meeting.performedActivities;
    }

    set performedActivities(value: string) {
        this.meeting.performedActivities = value;
    }

    get maxChars(): number {
        return this._maxChars;
    }
}
