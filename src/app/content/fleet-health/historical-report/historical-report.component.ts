import {Component, OnDestroy, OnInit} from '@angular/core';
import { DialogService } from '../../_services/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { Task } from '../../../shared/_models/task/task';
import {TimelineTooltipComponent} from './timeline-tooltip/timeline-tooltip.component';
import {HistoricalReportService} from './_services/historical-report.service';
import {DataService} from '../../../shared/_services/data.service';
import {TimelineTask} from '../../../shared/_models/task/timelineTask';
import {Validation} from '../../../shared/_models/validation';

@Component({
    selector: 'lsl-historical-report',
    templateUrl: './historical-report.component.html',
    styleUrls: ['./historical-report.component.scss'],
    providers: [
        TimelineTooltipComponent
    ]
})
export class HistoricalReportComponent implements OnInit, OnDestroy {

    private _task: Task;
    private _analyzedTask: TimelineTask;
    private _validations: Validation;
    private _ready: boolean;

    constructor(
        private _dialogService: DialogService,
        private _translate: TranslateService,
        private _historicalReportService: HistoricalReportService,
        private _messageData: DataService
    ) {
        this._translate.setDefaultLang('en');
        this.validations = new Validation(false, true, true, false);
        this.ready = false;

    }

    ngOnInit() {
        this.analyzedTask = TimelineTask.getInstance();
        this.task = this._historicalReportService.task;
    }

    ngOnDestroy() {
        this._historicalReportService.isAtaCorrected = false;
    }

    public updateAta(value: boolean) {
        this.ready = this.timelineData.filter(data => data.active !== true ).length === 0;
    }

    public openCancelDialog(): void {
        this._dialogService.closeAllDialogs();
        this._messageData.stringMessage('reload');
    }

    public setAnalizedTask(task: TimelineTask) {
        this.analyzedTask = task;
    }

    public submitForm() {
        if (this.validateForm()) {
            console.log('entró');
        }
    }

    public validateForm() {
        const noAnalyzedTask = this.timelineData.find(data => data.apply === null && data.active === false);
        return !noAnalyzedTask && this.isCorrected;
    }

    get task(): Task {
        return this._task;
    }

    set task(value: Task) {
        this._task = value;
    }

    set analyzedTask(value: TimelineTask) {
        this._analyzedTask = value;
    }

    get analyzedTask(): TimelineTask {
        return this._analyzedTask;
    }

    get validations(): Validation {
        return this._validations;
    }

    set validations(value: Validation) {
        this._validations = value;
    }

    get ready(): boolean {
        return this._ready;
    }

    set ready(value: boolean) {
        this._ready = value;
    }

    get timelineData(): TimelineTask[] {
        return this._historicalReportService.timelineData;
    }

    get isCorrected(): boolean {
        return this._historicalReportService.isAtaCorrected;
    }

}
