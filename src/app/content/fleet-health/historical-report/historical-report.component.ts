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

    private static TASK_SAVE_ANALYSIS_ENDPOINT = 'taskSaveAnalysis';
    private static CANCEL_COMPONENT_MESSAGE = 'OPERATIONS.CANCEL_COMPONENT.MESSAGE';
    private static SAVED_ANALYSIS = 'FLEET_HEALTH.REPORT.MSG.SAVED_ANALYSIS';
    private static REQUIRED_REVIEWS = 'FLEET_HEALTH.REPORT.ERROR.REQUIRED_REVIEWS';
    private static REQUIRED_ATA = 'FLEET_HEALTH.REPORT.ERROR.REQUIRED_ATA';
    private static REQUIRED_REPORT = 'FLEET_HEALTH.REPORT.ERROR.REQUIRED_REPORT';
    private static DEFAULT_ERROR = 'ERRORS.DEFAULT';

    private _analyzedTask: TimelineTask;
    private _validations: Validation;
    private _editorLoad: boolean;

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
        this.editorLoad = false;
    }

    ngOnDestroy() {
        this._historicalReportService.isAtaCorrected = false;
    }

    /**
     * Open a dialog for confirm the form cancellation
     */
    public openCancelDialog(): void {
        if (this.validateFilledItems()) {
            this._translate.get(HistoricalReportComponent.CANCEL_COMPONENT_MESSAGE)
                .subscribe((res: string) => {
                this._messageService.openFromComponent(CancelComponent, {
                    data: {message: res},
                    horizontalPosition: 'center',
                    verticalPosition: 'top'
                });
                this._messageData.stringMessage('reload');
            });
        } else {
            this._messageData.stringMessage('reload');
            this._dialogService.closeAllDialogs();
        }
    }

    /**
     * Validation for check touched elements
     * @returns {boolean}
     */
    private validateFilledItems(): boolean {
        if (this.task.timelineStatus === Task.OPEN_STATUS) {
            return this.isCorrected || this.editorContent !== '' || this.analyzedList.length > 0;
        } else {
            return false;
        }
    }


    /**
     * Save form data and reload the deferral list
     */
    public submitForm() {
        if (this.validateForm()) {
            const signature = this.getSignature();
            this._apiRestService
                .search<any>(HistoricalReportComponent.TASK_SAVE_ANALYSIS_ENDPOINT, signature)
                .subscribe(
                    () => {
                        this.getTranslateString(HistoricalReportComponent.SAVED_ANALYSIS);
                        this._dialogService.closeAllDialogs();
                        this._messageData.stringMessage('reload');
                    },
                    () => {
                        this.getTranslateString(HistoricalReportComponent.DEFAULT_ERROR);
                    }
                );
        }
    }

    /**
     * Get analysis for saving process
     * @returns {Analysis}
     */
    private getSignature(): Analysis {
        const analysis = Analysis.getInstance();
        analysis.barcode = this.task.barcode;
        analysis.ata = this.task.timelineStatus === Task.CLOSE_STATUS ? this.task.ata : this.newAta;
        analysis.reviews = this.reviews;
        analysis.username = this.user;
        analysis.alertCode = this.alertCode;
        analysis.remark = this.editorContent;
        return analysis;
    }

    /**
     * This validation process returns false; if:
     * - There isn't analyzed task
     * - The ATA isn't updated
     * - The editor content is empty when there aren't related tasks
     * @returns {boolean}
     */
    public validateForm() {
        if (this.unparsedTask) {
            this.getTranslateString(HistoricalReportComponent.REQUIRED_REVIEWS);
            return false;
        }
        if (!this.isCorrected && this.task.timelineStatus === Task.OPEN_STATUS) {
            this.getTranslateString(HistoricalReportComponent.REQUIRED_ATA);
            return false;
        }
        if (this.editorContent === '' && this.relatedTasks.length === 0) {
            this.getTranslateString(HistoricalReportComponent.REQUIRED_REPORT);
            return false;
        }
        return true;
    }

    /**
     * Subscription that translate a string and show a message
     * @param {string} toTranslate
     * @returns {Subscription}
     */
    private getTranslateString(toTranslate: string): Promise<void> {
        return this._translate.get(toTranslate).toPromise().then((res: string) => {
            this._messageService.openSnackBar(res, 2500);
        });
    }

    get task(): Task {
        return this._historicalReportService.task;
    }

    set task(value: Task) {
        this._historicalReportService.task = value;
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

    get unparsedTask(): TimelineTask {
        return this._historicalReportService.unparsedTask;
    }

    get analyzedList(): TimelineTask[] {
        return this._historicalReportService.analyzedList;
    }

    get alertCode(): string {
        return this.task.alertCode;
    }
    get isDisplayHistoricalReport(): boolean {
        return (this.isCorrected || this.task.timelineStatus === Task.CLOSE_STATUS);
    }

    get editorLoad(): boolean {
        return this._editorLoad;
    }

    set editorLoad(value: boolean) {
        this._editorLoad = value;
    }

    /**
     * Set the analyzed task from subcomponents
     * @param {TimelineTask} task
     */
    public setAnalizedTask(task: TimelineTask) {
        this.analyzedTask = task;
    }

    public setEditorLoad(value: boolean) {
        this.editorLoad = value;
    }
}
