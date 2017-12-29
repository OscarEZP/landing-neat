import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ActualTimeModel } from '../../shared/_models/actualTime';
import { Contingency } from '../../shared/_models/contingency';
import { Interval } from '../../shared/_models/interval';
import { Safety } from '../../shared/_models/safety';
import { Status } from '../../shared/_models/status';
import { StatusCode } from '../../shared/_models/statusCode';
import { TimeInstant } from '../../shared/_models/timeInstant';
import { User } from '../../shared/_models/user/user';
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

    private contingencySubcription: Subscription;
    private safetyEventSubcription: Subscription;
    private _followUp: Status;
    public currentUTCTime: number;
    public followUpForm: FormGroup;
    public safetyEventList: Safety[];
    private user: User;
    public selectedContingency: Contingency;
    public currentSafeEventCode: string;
    public statusCodes: StatusCode[];
    public durations: number[];
    public validations = {
        'optionalIsChecked': null,
        'isFollowUpDisabled': null,
        'isSending': null,
        'isSubmitted': null,
        'timeAlert': null,
        'delta': 0,
        'defaultTime': null,
        'lastStatus': null
    };

    /**
     * @param {DetailsService} _detailsService - Shared service of the detail sidebar
     * @param {ApiRestService} _apiRestService - Generic service to communicate with API
     * @param {MessageService} _messageService - Shared service to call loading and other services
     * @param {FormBuilder} fb - Form builder creator to validate and init the form
     * @param {StorageService} _storageService - Service to retrieve and save data in local storage
     * @param {DataService} _dataService - Service to transport data message between components subscribed
     */
    constructor(private _detailsService: DetailsService, private _apiRestService: ApiRestService, private _messageService: MessageService, private fb: FormBuilder, private _storageService: StorageService, private _dataService: DataService) {
        this._followUp = new Status(null, null, null, null, null, new Interval(null, null), null);

        this.currentUTCTime = 0;
        this.safetyEventList = [];
        this.selectedContingency = _detailsService.contingency;
        this.currentSafeEventCode = null;
        this.statusCodes = [];
        this.durations = [];
        this.validations = {
            'optionalIsChecked': false,
            'isFollowUpDisabled': false,
            'isSubmitted': false,
            'isSending': false,
            'timeAlert': false,
            'delta': 180,
            'defaultTime': 30,
            'lastStatus': false
        };

        this.followUpForm = fb.group({
            'safety': [null],
            'safetyEventCode': [null],
            'observation': [null, Validators.required],
            'code': [null, Validators.required],
            'duration': [30, Validators.required]
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
        this.getCurrentTime();
        this.getSafetyEventList();
        this.generateIntervalSelection();

        this.user = this._storageService.getCurrentUser();
        this.contingencySubcription = this._dataService.currentSelectedContingency.subscribe(message => this.contingencyChanged(message));
        this.safetyEventSubcription = this._dataService.currentSafeEventMessage.subscribe(message => this.currentSafeEventCode = message);
    }

    /**
     * Called when the component is destroyed to unsubscribe
     *
     * @return {void} nothing to return
     */
    ngOnDestroy() {
        this.contingencySubcription.unsubscribe();
        this.safetyEventSubcription.unsubscribe();
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
    private contingencyChanged(contingency: Contingency) {
        if (contingency !== null) {
            this.selectedContingency = contingency;

            this.generateIntervalSelection(this.selectedContingency.creationDate.epochTime);
            this.getStatusCodesAvailable();

            this.validations.lastStatus = this.selectedContingency.status.code === 'ETR' || 'NI4';
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
    private generateIntervalSelection(creationDate?: number) {
        let i: number;
        let quantity = 36;

        this.durations = [];

        this._apiRestService.getAll<ActualTimeModel>('dateTime')
            .subscribe(response => this.currentUTCTime = response.currentTimeLong);

        if (creationDate) {
            quantity = Math.ceil(((creationDate + (180 * 60000)) - this.currentUTCTime) / (60000 * 5));
        }

        if (0 < quantity && quantity < 37) {
            for (i = 0; i < quantity; i++) {
                this.durations.push(i * 5 + 5);
            }
            this.validations.isFollowUpDisabled = false;
        } else {
            this.validations.isFollowUpDisabled = true;
        }
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
        this._apiRestService
            .getSingle('configStatus', this.selectedContingency.status.code)
            .subscribe((data: StatusCode[]) => {
                this.statusCodes = data;
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
     * @param {string} code - String code from safety event list
     *
     * @example
     * this.selectActiveCode("FT3");
     *
     * @return {void} nothing to return
     */
    public selectActiveCode(code: string) {
        let i: number;
        for (i = 0; i < this.statusCodes.length; i++) {
            if (this.statusCodes[i].code === code) {
                this.validations.defaultTime = this.statusCodes[i].defaultTime;
                this.followUpForm.get('duration').setValue(this.validations.defaultTime);
                this.followUpForm.get('duration').updateValueAndValidity();
            }
        }
    }

    /**
     * Method to get current time from service, is called in the initialization of the component and everytime one value of the combo box is selected to calculate real remaining time.
     *
     * @return {void} nothing to return
     */
    public getCurrentTime() {
        this._dataService.stringMessage('open');
        this._apiRestService
            .getAll('dateTime')
            .subscribe((data: ActualTimeModel) => this.setCurrentTime(data.currentTimeLong),
                error => () => {
                    this._dataService.stringMessage('close');
                },
                () => {
                    this._dataService.stringMessage('close');
                });
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
    private setCurrentTime(currentTimeLong: number) {
        this.currentUTCTime = currentTimeLong;

        if (this.selectedContingency !== undefined) {
            this.validations.delta = Math.round((this.currentUTCTime - this.selectedContingency.creationDate.epochTime) / 600000);
            this.validations.timeAlert = this.validations.delta < this.followUpForm.get('duration').value;
        }
    }

    /**
     * Method to obtain the safety event list and populate a combo box.
     */
    public getSafetyEventList() {
        this._dataService.stringMessage('open');
        this._apiRestService
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
        this.validations.isSubmitted = true;

        if (this.followUpForm.valid) {
            this.validations.isSending = true;
            this._dataService.stringMessage('open');

            let rs;

            this._followUp.contingencyId = this.selectedContingency.id;
            this._followUp.code = value.code;
            this._followUp.observation = value.observation;
            this._followUp.requestedInterval = new Interval(new TimeInstant(null, null), value.duration);
            this._followUp.realInterval = new Interval(new TimeInstant(null, null), null);
            this._followUp.username = this.user.username;
            this._followUp.creationDate = null;
            const safetyCode = this.followUpForm.get('safetyEventCode').value;

            this._apiRestService
                .add<Response>('followUp', this._followUp, safetyCode)
                .subscribe((data: Response) => rs = data,
                    error => () => {
                        this._dataService.stringMessage('close');
                        this._messageService.openSnackBar(error);
                        this.validations.isSubmitted = false;
                        this.validations.isSending = false;
                    },
                    () => {
                        this._detailsService.closeSidenav();
                        this._dataService.stringMessage('reload');
                        this._messageService.openSnackBar('created');
                        this._dataService.stringMessage('close');
                        this.validations.isSubmitted = false;
                        this.validations.isSending = false;
                    });
        }
    }

    /**
     * Method to change the validation of form when the safety event checkbox is selected or unselected
     *
     * @return {void} nothing to return
     */
    public onSelectOptional() {
        if (!this.validations.optionalIsChecked) {
            this.followUpForm.get('safetyEventCode').setValidators(Validators.required);
            this.followUpForm.get('safetyEventCode').updateValueAndValidity();
        } else {

            this.followUpForm.get('safetyEventCode').setValue(null);
            this.followUpForm.get('safetyEventCode').setValidators(null);
            this.followUpForm.get('safetyEventCode').updateValueAndValidity();
        }
    }

}
