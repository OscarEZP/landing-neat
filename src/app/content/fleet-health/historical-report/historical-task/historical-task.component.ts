import {Component, Input, OnInit} from '@angular/core';
import {HistoricalTask} from '../../../../shared/_models/task/historical/historicalTask';
import {Subscription} from 'rxjs/Subscription';
import {ApiRestService} from '../../../../shared/_services/apiRest.service';
import {HttpClient} from '@angular/common/http';
import {HistoricalReportService} from '../_services/historical-report.service';

@Component({
    selector: 'lsl-historical-task',
    templateUrl: './historical-task.component.html',
    styleUrls: ['./historical-task.component.scss']
})
export class HistoricalTaskComponent implements OnInit {

    private _historicalTask: HistoricalTask;
    private _apiRestService: ApiRestService;

    constructor(
        httpClient: HttpClient,
        private _historicalReportService: HistoricalReportService
    ) {
        this.apiRestService = new ApiRestService(httpClient);
    }

    ngOnInit() {
        this.historicalTask = HistoricalTask.getInstance();
        this.getHistoricalTask('T009R9LM'); // test propose only
    }

    @Input()
    public getHistoricalTask(barcode: string): Subscription {
        return this.apiRestService
            .getSingle<HistoricalTask>('taskHistoricalReport', barcode)
            .subscribe((response: HistoricalTask) => {
                this.historicalTask = response;
            });
    }

    public copyText() {
        let text = '';
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document['selection'] && document['selection'].type !== 'Control') {
            text = document['selection'].createRange().text;
        }

        this.editorContent = this.editorContent ? this.editorContent + text : text;
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


}
