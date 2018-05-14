import {Component, Input, OnInit} from '@angular/core';
import {HistoricalTask} from '../../../../shared/_models/task/historical/historicalTask';
import {Subscription} from 'rxjs/Subscription';
import {ApiRestService} from '../../../../shared/_services/apiRest.service';
import {HttpClient} from '@angular/common/http';
import {HistoricalReportService} from '../_services/historical-report.service';
import {TimelineTask} from '../../../../shared/_models/task/timelineTask';

@Component({
    selector: 'lsl-historical-task',
    templateUrl: './historical-task.component.html',
    styleUrls: ['./historical-task.component.scss']
})
export class HistoricalTaskComponent implements OnInit {

    private static TASK_HISTORICAL_REPORT_ENDPOINT = 'taskHistoricalReport';

    private _historicalTask: HistoricalTask;
    private _apiRestService: ApiRestService;
    private _analyzedTask: TimelineTask;

    @Input()
    set analyzedTask(value: TimelineTask) {
        if (value && value.task.barcode) {
            this.getHistoricalTask(value.task.barcode);
            this._analyzedTask = value;
        }
    }

    constructor(
        httpClient: HttpClient,
        private _historicalReportService: HistoricalReportService
    ) {
        this.apiRestService = new ApiRestService(httpClient);
        this._analyzedTask = null;
    }

    ngOnInit() {
        this.historicalTask = HistoricalTask.getInstance();
    }

    /**
     * Get the historical task by a barcode
     * @param {string} barcode
     * @returns {Subscription}
     */
    public getHistoricalTask(barcode: string): Subscription {
        return this.apiRestService
            .getSingle<HistoricalTask>(HistoricalTaskComponent.TASK_HISTORICAL_REPORT_ENDPOINT, barcode)
            .subscribe((response: HistoricalTask) => {
                this.historicalTask = response;
            });
    }

    /**
     * Copy text to editor when the analyzed task is checked
     */
    public copyText() {
        const selection = this.getSelection();
        if (selection.length > 0 && selection.indexOf(this.header) === -1) {
            this.addHeader();
            this.editorContent = this.editorContent ? this.editorContent + selection : selection;
        }
    }

    /**
     * Add ATA and Barcode to copied text
     * @param {string} text
     */
    private addHeader() {
        if (this.editorContent.indexOf(this.header) === -1) {
            const init = this.editorContent.length > 0 ? this.quillEditor.getText().length : 0;
            this.quillEditor.insertText(init, this.taskType.toUpperCase(), 'bold', true);
            this.quillEditor.insertText(this.quillEditor.getText().length, this.header, 'bold', true);
        }
    }

    /**
     * Get selected text
     * @returns {string}
     */
    private getSelection(): string {
        let text = '';
        if (window.getSelection) {
            text = window.getSelection().toString().replace(/\n/g, '<br>\n');
        } else if (document['selection'] && document['selection'].type !== 'Control') {
            text = document['selection'].createRange().text;
        }
        return text;
    }

    get header(): string {
        return this.analyzedTask.task.ata + ' / ' + this.analyzedTask.task.barcode;
    }

    get historicalTask(): HistoricalTask {
        return this._historicalTask;
    }

    set historicalTask(value: HistoricalTask) {
        this._historicalTask = value;
    }

    get apiRestService(): ApiRestService {
        return this._apiRestService;
    }

    set apiRestService(value: ApiRestService) {
        this._apiRestService = value;
    }

    set editorContent(value: string) {
        this._historicalReportService.editorContent = value;
    }

    get editorContent(): string {
        return this._historicalReportService.editorContent;
    }

    get analyzedTask(): TimelineTask {
        return this._analyzedTask;
    }

    get taskType(): string {
        return this.analyzedTask.active ? TimelineTask.TASK_DEFAULT_TITLE : this.analyzedTask.task.taskType;
    }

    get quillEditor() {
        return this._historicalReportService.qEditorInstance;
    }

    get isAtaCorrected(): boolean {
        return this._historicalReportService.isAtaCorrected;
    }

    public getRelatedTimelineData(): TimelineTask[] {
        return this._historicalReportService.timelineData.filter(data => data.active === false);
    }
}
