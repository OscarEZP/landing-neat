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

    private _historicalTask: HistoricalTask;
    private _apiRestService: ApiRestService;
    private _analyzedTask: TimelineTask;

    @Input()
    set analyzedTask(value: TimelineTask) {
        if (!value.active) {
            this.getHistoricalTask(value.task.barcode);
            this._analyzedTask = value;
        }
    }

    constructor(
        httpClient: HttpClient,
        private _historicalReportService: HistoricalReportService
    ) {
        this.apiRestService = new ApiRestService(httpClient);
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
            .getSingle<HistoricalTask>('taskHistoricalReport', barcode)
            .subscribe((response: HistoricalTask) => {
                this.historicalTask = response;
            });
    }

    /**
     * Copy text to editor when the analyzed task is apply
     */
    public copyText() {
        const selection = this.getSelection();
        if (this.analyzedTask.apply && selection.length > 0 && selection.indexOf(this.header) === -1) {
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
            this.quillEditor.insertText(init, 'REPORT', 'bold', true);
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
            text = window.getSelection().toString();
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

    get quillEditor() {
        return this._historicalReportService.qEditorInstance;
    }
}
