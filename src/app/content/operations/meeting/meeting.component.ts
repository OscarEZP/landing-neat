import {Component, Inject, OnInit} from '@angular/core';
import { DialogService } from '../../_services/dialog.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TimeInstant } from '../../../shared/_models/timeInstant';
import { Contingency } from '../../../shared/_models/contingency/contingency';
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
import { CancelComponent } from '../cancel/cancel.component';
import {Activity} from '../../../shared/_models/activity';
import {Assistant} from '../../../shared/_models/assistant';
import {Meeting} from '../../../shared/_models/meeting';
import {Mail} from '../../../shared/_models/configuration/mail';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';

@Component({
    selector: 'lsl-meeting-form',
    templateUrl: './meeting.component.html',
    styleUrls: ['./meeting.component.scss'],
})

export class MeetingComponent implements OnInit {

    private static MEETINGS_ENDPOINT = 'meetings';
    private static MEETINGS_CONFIG_TYPE = 'MEETING_ACTIVITIES';

    private _meetingForm: FormGroup;
    private _assistantForm: FormGroup;
    private _utcModel: TimeInstant;
    private _timeClock: Date;
    private _interval: number;
    private _alive: boolean;
    private _meetingActivitiesConf: Types[];
    private _meetingActivities: Activity[];
    private _validations: Validation;
    private _snackbarMessage: string;
    private _meetingAssistants: Assistant[];
    private _assistant: Assistant;
    private _mails: string[];
    public selectedOptions = [];
    public searchForm: FormGroup;
    public filteredOptions: Observable<string[]>;

    constructor(
        private _dialogService: DialogService,
        private _fb: FormBuilder,
        private _clockService: ClockService,
        private _datetimeService: DatetimeService,
        private _messageData: DataService,
        private _messageService: MessageService,
        private _apiRestService: ApiRestService,
        @Inject(MAT_DIALOG_DATA) private _contingency: Contingency,
        private _translate: TranslateService,
    ) {
        this._interval = 1000 * 60;
        this._alive = true;
        const initFakeDate = new Date().getTime();
        this.utcModel = new TimeInstant(initFakeDate, null);
        this.meetingForm = this.getFormValidators();
        this.meetingActivities = [];
        this.mails = [];
        this.getMailsConf();
        this.setMeetingActivitiesConf();
        this.validations = new Validation(false, true, true, false);
        this.meetingAssistants = [];
        this.assistant = new Assistant('');

        this.assistantForm = this._fb.group({
            assistantMail: [this.assistant.mail, [Validators.required, Validators.email]],
            mailSelected: new FormControl()
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
                    return this.filter(val);
                })
            );
    }

    filter(val: string): string[] {
        return this.mails.filter(option =>
        option.toLowerCase().indexOf(val.toLowerCase()) === 0);
    }
    /**
     * Get form with validators
     * @return {FormGroup}
     */
    private getFormValidators(): FormGroup {

        this.meetingForm = this._fb.group({});
        const barcodeValidators = [Validators.pattern('^[a-zA-Z0-9]+\\S$'), Validators.maxLength(80)];
        if (this.contingency.safetyEvent.code !== null) {
            barcodeValidators.push(Validators.required);
        }
        this.meetingForm.addControl('barcode', new FormControl(this.contingency.barcode, barcodeValidators));
        return this.meetingForm;
    }

    /**
     * Get configuration for meeting activities
     */
    private setMeetingActivitiesConf(): void {
        this._apiRestService.getSingle('configTypes', MeetingComponent.MEETINGS_CONFIG_TYPE).subscribe(rs => {

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
     * Submit meeting form
     */
    public submitForm() {
        if (this.meetingForm.valid) {
            const signature = this.getSignature();
            this.validations.isSending = true;
            let res: Response;
            this._apiRestService
            .add<Response>(MeetingComponent.MEETINGS_ENDPOINT, signature)
            .subscribe(response => res = response,
                err => {
                    this.getTranslateString('OPERATIONS.MEETING_FORM.FAILURE_MESSAGE');
                    const message: string = err.error.message !== null ? err.error.message : this.snackbarMessage;
                    this._messageService.openSnackBar(message);
                    this.validations.isSending = false;
                }, () => {
                    this.getTranslateString('OPERATIONS.MEETING_FORM.SUCCESSFULLY_MESSAGE');
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
     * Submit addAssistant form
     */
    public addAssistant(): void {
        if (this.assistantForm.valid) {
            const currentAssistant = new Assistant(this.assistant.mail);
            const findAssistant = this.meetingAssistants.find(x => x.mail==currentAssistant.mail);
            if (typeof findAssistant === 'undefined') {
                this.meetingAssistants.push(currentAssistant);
            }
            console.log(findAssistant, currentAssistant, this.meetingAssistants);
        }
    }

    private getMailsConf(): void {
        this._apiRestService
            .getAll<Mail[]>('mails')
            .subscribe(rs => {
                    console.log('response:',  rs)
                    rs.forEach(mail=> this.mails.push(mail.address) );
                    console.log(this.mails);
                });
    }
    /**
     * Get a Meeting Object to sending data
     * @return {Meeting}
     */
    private getSignature(): Meeting {
        return new Meeting(null,
            this.contingency.id,
            this.meetingActivities,
            this.contingency.barcode,
            this.contingency.username,
            this.contingency.creationDate,
            this.contingency.safetyEvent.code,
            this.meetingAssistants
        );
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
     *
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
        return counterPristine < counterItems;
    }

    /**
     * Change checkbox value to false if apply slider is false
     * @param meetingActivity
     */
    public checkApply(meetingActivity: Activity) {
        meetingActivity.done = !meetingActivity.apply ? false : meetingActivity.done;
        Object.keys(this.meetingActivities).forEach((elem, i) => {
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
        return this._meetingActivities;
    }

    set meetingActivities(value: Activity[]) {
        this._meetingActivities = value;
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
        return this._meetingAssistants;
    }

    set meetingAssistants(value: Assistant[]) {
        this._meetingAssistants = value;
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

}
