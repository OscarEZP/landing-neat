import {Component, OnDestroy, OnInit} from '@angular/core';
import { DialogService } from '../../_services/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { Task } from '../../../shared/_models/task/task';
import {TimelineTooltipComponent} from './timeline-tooltip/timeline-tooltip.component';
import {HistoricalReportService} from './_services/historical-report.service';
import {DataService} from '../../../shared/_services/data.service';
import {TimelineTask} from '../../../shared/_models/task/timelineTask';
import {Validation} from '../../../shared/_models/validation';
import {MessageService} from '../../../shared/_services/message.service';
import {ApiRestService} from '../../../shared/_services/apiRest.service';
import {Analysis} from '../../../shared/_models/task/analysis/analysis';
import {Review} from '../../../shared/_models/task/analysis/review';
import {StorageService} from '../../../shared/_services/storage.service';
import {CancelComponent} from '../../operations/cancel/cancel.component';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'lsl-historical-report',
    templateUrl: './historical-report.component.html',
    styleUrls: ['./historical-report.component.scss'],
    providers: [
        TimelineTooltipComponent
    ]
})
export class HistoricalReportComponent implements OnInit, OnDestroy {

    private static TASK_SAVE_ANALYSIS = 'taskSaveAnalysis';

    private _task: Task;
    private _analyzedTask: TimelineTask;
    private _validations: Validation;

    constructor(
        private _dialogService: DialogService,
        private _translate: TranslateService,
        private _historicalReportService: HistoricalReportService,
        private _messageData: DataService,
        private _messageService: MessageService,
        private _apiRestService: ApiRestService,
        private _storageService: StorageService,
    ) {
        this._translate.setDefaultLang('en');
        this.validations = new Validation(false, true, true, false);
    }

    ngOnInit() {
        this.analyzedTask = TimelineTask.getInstance();
        this.task = this._historicalReportService.task;
    }

    ngOnDestroy() {
        this._historicalReportService.isAtaCorrected = false;
    }

    public openCancelDialog(): void {
        if (this.validateFilledItems()) {
            this._translate.get('OPERATIONS.CANCEL_COMPONENT.MESSAGE')
                .subscribe((res: string) => {
                this._messageService.openFromComponent(CancelComponent, {
                    data: {message: res},
                    horizontalPosition: 'center',
                    verticalPosition: 'top'
                });
            });
        } else {
            this._dialogService.closeAllDialogs();
        }
    }

    private validateFilledItems(): boolean {
        return this.isCorrected || this.editorContent !== '' || this.analyzedList.length > 0;
    }

    public setAnalizedTask(task: TimelineTask) {
        this.analyzedTask = task;
    }

    public submitForm() {
        if (this.validateForm()) {
            const signature = this.getSignature();
            this._apiRestService
                .search<any>(HistoricalReportComponent.TASK_SAVE_ANALYSIS, signature)
                .subscribe(
                    response => {
                        this.getTranslateString('FLEET_HEALTH.REPORT.MSG.SAVED_ANALYSIS');
                        this._dialogService.closeAllDialogs();
                        this._messageData.stringMessage('reload');
                    },
                    error => {
                        this.getTranslateString('ERRORS.DEFAULT');
                    }
                );
        }
    }

    private getSignature(): Analysis {
        const analysis = Analysis.getInstance();
        analysis.barcode = this.task.barcode;
        analysis.ata = this.newAta;
        analysis.reviews = this.reviews;
        analysis.username = this.user;
        analysis.alertCode = 'OTSD';
        analysis.remark = this.editorContent;
        return analysis;
    }

    public validateForm() {
        if (this.noAnalyzedTask) {
            this.getTranslateString('FLEET_HEALTH.REPORT.ERROR.REQUIRED_REVIEWS');
        }
        if (!this.isCorrected) {
            this.getTranslateString('FLEET_HEALTH.REPORT.ERROR.REQUIRED_ATA');
        }
        if (this.editorContent === '' && this.relatedTasks.length === 0) {
            this.getTranslateString('FLEET_HEALTH.REPORT.ERROR.REQUIRED_REPORT');
        }
        return !this.noAnalyzedTask && this.isCorrected;
    }

    private getTranslateString(toTranslate: string): Subscription {
        return this._translate.get(toTranslate).subscribe((res: string) => {
            this._messageService.openSnackBar(res);
        });
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

    get timelineData(): TimelineTask[] {
        return this._historicalReportService.timelineData;
    }

    get isCorrected(): boolean {
        return this._historicalReportService.isAtaCorrected;
    }

    get newAta(): string {
        return this._historicalReportService.newAta;
    }

    get reviews(): Review[] {
        return this._historicalReportService.reviews;
    }

    get user(): string {
        return this._storageService.username;
    }

    get editorContent(): string {
        return this._historicalReportService.editorContent;
    }

    get relatedTasks(): Task[] {
        return this._historicalReportService.relatedTasks;
    }

    get noAnalyzedTask(): TimelineTask {
        return this._historicalReportService.noAnalyzedTask;
    }

    get analyzedList(): TimelineTask[] {
        return this._historicalReportService.analyzedList;
    }

}
