import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forEach } from '@angular/router/src/utils/collection';
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

@Component({
    selector: 'lsl-follow-up',
    templateUrl: './follow-up.component.html',
    styleUrls: ['./follow-up.component.css']
})
export class FollowUpComponent implements OnInit {

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
        'isSubmitted': null,
        'timeAlert': null,
        'delta': 0,
        'defaultTime': 0
    };

    constructor(private _detailsService: DetailsService, private _apiRestService: ApiRestService, private _messageService: MessageService, private fb: FormBuilder, private _storageService: StorageService, private _dataService: DataService) {
        this._followUp = new Status(null, null, null, null, null, new Interval(null, null), null);

        this.currentUTCTime = 0;
        this.safetyEventList = [];
        this.selectedContingency = null;
        this.currentSafeEventCode = null;
        this.statusCodes = [];
        this.durations = [];
        this.validations = {
            optionalIsChecked: false,
            'isFollowUpDisabled': false,
            'isSubmitted': false,
            'timeAlert': false,
            'delta': 180,
            'defaultTime': 30
        };

        this.followUpForm = fb.group({
            'safety': [null],
            'safetyEventCode': [null],
            'observation': [null, Validators.required],
            'code': [null, Validators.required],
            'duration': [this.validations.defaultTime, Validators.required]
        });
    }

    ngOnInit() {
        this.getCurrentTime();
        this.getSafetyEventList();
        this.generateIntervalSelection();

        this.user = this._storageService.getCurrentUser();
        this._dataService.currentSelectedContingency.subscribe(message => this.contingencyChanged(message));
        this._dataService.currentSafeEventMessage.subscribe(message => this.currentSafeEventCode = message);

        this.generateStatusCodes();
    }

    private contingencyChanged(contingency: Contingency) {
        if (contingency !== null) {
            this.selectedContingency = contingency;

            this.generateIntervalSelection(this.selectedContingency.creationDate.epochTime);
        }
    }

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
        } else {
            this.validations.isFollowUpDisabled = true;
        }
    }

    private generateStatusCodes(): StatusCode[] {
        let i: number;
        const codes: string[] = ['NI1', 'NI2', 'NI3', 'NI4', 'ETR'];

        for (i = 0; i < 5; i++) {
            this.statusCodes.push(new StatusCode(codes[i], 45, true));
        }

        return this.statusCodes;
    }

    public selectActiveCode(code: string) {
        let i: number;
        for (i = 0; i < this.statusCodes.length; i++) {
            if (this.statusCodes[i].code === code) {
                this.validations.defaultTime = this.statusCodes[i].defaultTime;
                this.followUpForm.get('code').setValue(this.validations.defaultTime);
                this.followUpForm.get('code').updateValueAndValidity();
            }
        }
    }

    public getCurrentTime() {
        this._apiRestService
            .getAll('dateTime')
            .subscribe((data: ActualTimeModel) => this.setCurrentTime(data.currentTimeLong),
                error => () => {
                },
                () => {

                });
    }

    private setCurrentTime(currentTimeLong: number) {
        this.currentUTCTime = currentTimeLong;

        if (this.selectedContingency !== null) {
            this.validations.delta = Math.round(((this.selectedContingency.creationDate.epochTime + 180 * 60000) - this.currentUTCTime) / 60000);
            this.validations.timeAlert = this.validations.delta < this.followUpForm.get('duration').value;
        }
    }

    public getSafetyEventList() {

        this._apiRestService
            .getAll<Safety[]>('safetyEvent')
            .subscribe(data => this.safetyEventList = data,
                error => () => {
                    this._messageService.openSnackBar(error.message);
                },
                () => {

                });
    }

    public closeDetails() {
        this._detailsService.closeSidenav();
    }

    public submitForm(value: any) {
        this.validations.isSubmitted = true;

        if (this.followUpForm.valid) {
            
            this.validations.isSubmitted = false;
            let rs;

            this._followUp.contingencyId = this.selectedContingency.id;
            this._followUp.code = value.code;
            this._followUp.observation = value.observation;
            this._followUp.requestedInterval = new Interval(new TimeInstant(null, null), value.duration);
            this._followUp.realInterval = new Interval(new TimeInstant(null, null), null);
            this._followUp.username = this.user.username;
            this._followUp.creationDate = null;
            const safetyCode =  this.followUpForm.get('safetyEventCode').value;

            this._apiRestService
                .add<Response>('followUp', this._followUp, safetyCode)
                .subscribe((data: Response) => rs = data,
                    error => () => {
                        console.error(error);
                        this._messageService.openSnackBar(error);
                    },
                    () => {
                        this._messageService.openSnackBar('created');
                    });
        }
    }

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
