import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {HistoricalTask} from '../../../../shared/_models/task/historical/historicalTask';
import {Subscription} from 'rxjs/Subscription';
import {ApiRestService} from '../../../../shared/_services/apiRest.service';
import {HttpClient} from '@angular/common/http';
import {HistoricalReportService} from '../_services/historical-report.service';
import {TimelineTask} from '../../../../shared/_models/task/timelineTask';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {PartGroup} from '../../../../shared/_models/task/historical/partGroup';
import {TimeInstant} from '../../../../shared/_models/timeInstant';

export interface PartInterface {
    description: string;
    partGroup: PartGroup;
    quantity: number;
    estimatedArrivalDate: TimeInstant;
    status: string;
}

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
    private _dataSource: MatTableDataSource<any>;
    private _displayedColumns: string[];
    private _tableData: PartInterface[];
    private _pageSize: number;
    private _dateFormat: string;
    private _hourFormat: string;

    @ViewChild(MatPaginator) paginator: MatPaginator;

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
        this._displayedColumns = ['description', 'partGroup', 'quantity', 'eta', 'status'];
        this._tableData = [];
        this._pageSize = 5;
        this._dateFormat = 'dd-MM-yyyy';
        this._hourFormat = 'HH:mm';
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
                this.tableData = response.parts.map(p => {
                    const newPart: PartInterface = {
                        description: p.name,
                        partGroup: p.partGroup,
                        quantity: p.quantity,
                        estimatedArrivalDate: p.estimatedArrivalDate,
                        status: p.status
                    };
                    return newPart;
                });
                this.dataSource = new MatTableDataSource<any>(this.tableData);
                this.dataSource.paginator = this.paginator;
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

    public getRelatedTimelineData(): TimelineTask[] {
        return this._historicalReportService.timelineData.filter(data => data.active === false);
    }

    get dataSource(): MatTableDataSource<any> {
        return this._dataSource;
    }

    set dataSource(value: MatTableDataSource<any>) {
        this._dataSource = value;
    }

    get displayedColumns(): string[] {
        return this._displayedColumns;
    }

    set displayedColumns(value: string[]) {
        this._displayedColumns = value;
    }

    get tableData(): PartInterface[] {
        return this._tableData;
    }

    set tableData(value: PartInterface[]) {
        this._tableData = value;
    }

    get pageSize(): number {
        return this._pageSize;
    }

    set pageSize(value: number) {
        this._pageSize = value;
    }

    get dateFormat(): string {
        return this._dateFormat;
    }

    set dateFormat(value: string) {
        this._dateFormat = value;
    }

    get hourFormat(): string {
        return this._hourFormat;
    }

    set hourFormat(value: string) {
        this._hourFormat = value;
    }
}
