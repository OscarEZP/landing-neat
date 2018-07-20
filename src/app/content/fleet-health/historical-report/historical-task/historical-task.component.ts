import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ApiRestService} from '../../../../shared/_services/apiRest.service';
import {HistoricalReportService} from '../_services/historical-report.service';
import {TimelineTask} from '../../../../shared/_models/task/timelineTask';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {PartGroup} from '../../../../shared/_models/task/detail/partGroup';
import {TimeInstant} from '../../../../shared/_models/timeInstant';
import {DateUtil} from '../../../../shared/util/dateUtil';
import {DetailTask} from '../../../../shared/_models/task/detail/detailTask';

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

    private static TASK_DETAIL_ENDPOINT = 'taskDetail';
    private static MOMENT_DATE_FORMAT = 'DD-MM-YYYY';

    private _dateFormat: string;
    private _detailTask: DetailTask;
    private _analyzedTask: TimelineTask;
    private _editorLoad: boolean;
    private _dataSource: MatTableDataSource<any>;
    private _displayedColumns: string[];
    private _tableData: PartInterface[];
    private _pageSize: number;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    @Input()
    set analyzedTask(value: TimelineTask) {
        if (value && value.task.barcode) {
            this.getDetailTask(value.task.barcode);
            this._analyzedTask = value;
        }
    }

    @Input()
    set editorLoad(value: boolean) {
        this._editorLoad = value;
    }

    get editorLoad(): boolean {
        return this._editorLoad;
    }

    constructor(
        private _historicalReportService: HistoricalReportService,
        private _apiRestService: ApiRestService
    ) {
        this._analyzedTask = null;
        this._displayedColumns = ['description', 'partGroup', 'quantity', 'eta', 'status'];
        this._tableData = [];
        this._pageSize = 5;
        this._dateFormat = 'dd-MM-yyyy HH:mm';
    }

    ngOnInit() {
        this.detailTask = DetailTask.getInstance();
        this.editorLoad = false;
    }

    /**
     * Get the Detail task by Barcode (Parts, Accions, Step)
     * @param {string} barcode
     * @returns {Subscription}
     */
    public getDetailTask(barcode: string): Subscription {
        return this._apiRestService
            .getSingle<DetailTask>(HistoricalTaskComponent.TASK_DETAIL_ENDPOINT, barcode)
            .subscribe((response: DetailTask) => {
                this.detailTask = response;
                if (this.editorLoad) {
                    this.editorContent = this.detailTask.report;
                }
                this.tableData = response.parts.map(p => {
                    const newPart: PartInterface = {
                        description: p.code,
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
            const insertText = this.editorContent.length > 0 ? '\r' + this.header : this.header;
            this.quillEditor.insertText(init, insertText, 'bold', true);
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
        const arrHeader = [
            this.taskType.toUpperCase(),
            this.analyzedTask.task.ata,
            this.analyzedTask.task.barcode,
            DateUtil.formatDate(this.detailTask.creationDate.epochTime, HistoricalTaskComponent.MOMENT_DATE_FORMAT)
        ];
        return arrHeader.join(' / ');
    }

    get detailTask(): DetailTask {
        return this._detailTask;
    }

    set detailTask(value: DetailTask) {
        this._detailTask = value;
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
}
