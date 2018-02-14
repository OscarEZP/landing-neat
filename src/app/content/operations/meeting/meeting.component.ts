import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
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

@Component({
    selector: 'lsl-meeting-form',
    templateUrl: './meeting.component.html',
    styleUrls: ['./meeting.component.scss']
})

export class MeetingComponent implements OnInit, OnDestroy {

    private static MEETINGS_ENDPOINT = 'meetings';
    private static MAILS_ENDPOINT = 'mails';
    private static MEETINGS_CONFIG_TYPE = 'MEETING_ACTIVITIES';
    private static BARCODE_PATTERN = '^[a-zA-Z0-9]+\\S$';

    private _meetingSubscription: Subscription;
    private _emailsSubscription: Subscription;
    private _meetingActivitiesSubscription: Subscription;
    private _emailsConfSubscription: Subscription;

    private _meetingForm: FormGroup;
    private _assistantForm: FormGroup;
    private _agreementForm: FormGroup;

    private _utcModel: TimeInstant;
    private _timeClock: Date;
    private _interval: number;
    private _alive: boolean;
    private _meetingActivitiesConf: Types[];
    private _validations: Validation;
    private _snackbarMessage: string;
    private _assistant: Assistant;
    private _mails: string[];
    public filteredOptions: Observable<string[]>;
    private _meeting: Meeting;
    private _agreement: string;

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
        this.utcModel = new TimeInstant(initFakeDate, null);
        this.meetingForm = this.getFormValidators();

        const username = this._storageService.getCurrentUser().username;

        this.mails = [];
        this._emailsConfSubscription = this.getMailsConf();
        this._meetingActivitiesSubscription = this.setMeetingActivitiesConf();
        this.validations = Validation.getInstance();


        this.assistant = new Assistant('');

        this.meeting = new Meeting(this.contingency.id);
        this.meeting.createUser = username;

        this.barcode = this.contingency.barcode;
        this.safetyCode = this.contingency.safetyEvent.code;

        this.agreement = '';

        this.assistantForm = this._fb.group({
            assistantMail: [this.assistant.mail, {validators: MeetingComponent.emailValidator}],
            mailSelected: new FormControl()
        });

        this.agreementForm = this._fb.group({
            agreement: ['']
        });

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
        this.filteredOptions = this.assistantForm.controls['assistantMail'].valueChanges
            .pipe(
                startWith(''),
                map(val => {
                    if (val.length >= 3) {
                        return this.filter(val);
                    }
                })
            );
    }

    ngOnDestroy() {
        this._meetingActivitiesSubscription.unsubscribe();
        if (this._meetingSubscription) {
            this._meetingSubscription.unsubscribe();
        }
        if (this._emailsSubscription) {
            this._emailsSubscription.unsubscribe();
        }
    }


    /**
     * Filter for show email coincidencies
     * @param val
     * @return {string[]}
     */
    public filter(val: string): string[] {
        return this.mails.filter(option =>
            option.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }

    /**
     * Get form with validators
     * @return {FormGroup}
     */
    private getFormValidators(): FormGroup {
        this.meetingForm = this._fb.group({
            meetingAsistants: ['', Validators.required]
        });
        const barcodeValidators = [Validators.pattern(MeetingComponent.BARCODE_PATTERN), Validators.maxLength(80)];
        if (this.contingency.safetyEvent.code !== null) {
            barcodeValidators.push(Validators.required);
        }
        this.meetingForm.addControl('barcode', new FormControl(this.contingency.barcode, barcodeValidators));
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
     * Save meeting form
     */
    public submitForm() {
        if (this.meetingForm.valid) {
            const signature = this.getSignature();
            this.validations.isSending = true;
            let res: Response;
            this._meetingSubscription = this._apiRestService
                .add<Response>(MeetingComponent.MEETINGS_ENDPOINT, signature)
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
     * Add emaill to list and clean text input
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
     * Delete Assistant Meeting from assistant list
     */
    deleteAssistantMeeting(index: number) {
        if (index !== -1) {
            this.meetingAssistants.splice(index, 1);
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
     * Get a Meeting Object to sending data
     * @return {Meeting}
     */
    private getSignature(): Meeting {
        return this.meeting;
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
}
