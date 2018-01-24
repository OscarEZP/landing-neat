import {Component, Inject, OnInit} from '@angular/core';
import { DialogService } from '../../_services/dialog.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TimeInstant } from '../../../shared/_models/timeInstant';
import { Contingency } from '../../../shared/_models/contingency';
import {ClockService} from '../../../shared/_services/clock.service';
import {TimerObservable} from 'rxjs/observable/TimerObservable';
import {DatetimeService} from '../../../shared/_services/datetime.service';
import {DataService} from '../../../shared/_services/data.service';
import {MAT_DIALOG_DATA} from '@angular/material';
import {ApiRestService} from '../../../shared/_services/apiRest.service';
import {GroupTypes} from '../../../shared/_models/configuration/groupTypes';
import {Types} from '../../../shared/_models/configuration/types';

@Component({
    selector: 'lsl-meeting-form',
    templateUrl: './meeting.component.html',
    styleUrls: ['./meeting.component.scss']
})

export class MeetingComponent implements OnInit {

    private _meetingForm: FormGroup;
    private _utcModel: TimeInstant;
    private _contingency: Contingency;
    private _timeClock: Date;
    private _interval: number;
    private _alive: boolean;
    private _meetingActivities: Types[];

    constructor(
        private _dialogService: DialogService,
        private _fb: FormBuilder,
        private _clockService: ClockService,
        private _datetimeService: DatetimeService,
        private _messageData: DataService,
        private _apiRestService: ApiRestService,
        @Inject(MAT_DIALOG_DATA) private _contingency: any
    ) {
        this._interval = 1000 * 60;
        this._alive = true;
        const initFakeDate = new Date().getTime();
        this.utcModel = new TimeInstant(initFakeDate, null);
        this.meetingForm = _fb.group({
            'barcode': [this.contingency.barcode, [Validators.pattern('^[a-zA-Z0-9]+\\S$'), Validators.maxLength(80)]],
        });
        console.log(this.contingency);
        this.getMeetingActivities();
    }

    ngOnInit(): void {
        TimerObservable.create(0, this._interval)
        .takeWhile(() => this._alive)
        .subscribe(() => {
            this._datetimeService.getTime()
            .subscribe((data) => {
                this.utcModel = new TimeInstant(data.currentTimeLong, data.currentTime);
                this.newMessage();
                this._clockService.setClock(this.utcModel.epochTime);
            });
        });
        this._clockService.getClock().subscribe(time => this.timeClock = time);
    }

    private getMeetingActivities(): void {
        this._apiRestService.getSingle('configTypes', 'MEETING_ACTIVITIES').subscribe(rs => {
            const res = rs as GroupTypes;
            this.meetingActivities = res.types;
        });
    }

    private newMessage(): void {
        this._messageData.changeTimeUTCMessage(this.utcModel.epochTime);
    }

    public closeDialog(): void {
        this._dialogService.closeAllDialogs();
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

    get meetingActivities(): Types[] {
        return this._meetingActivities;
    }

    set meetingActivities(value: Types[]) {
        this._meetingActivities = value;
    }
}
