import {Component, OnInit, ViewChild} from '@angular/core';
import {HistoricalReportService} from '../_services/historical-report.service';
import {QuillEditorComponent} from 'ngx-quill';
import {QuillConfiguration} from '../../../../shared/_models/components/quillConfiguration';

@Component({
    selector: 'lsl-analysis-report',
    templateUrl: './analysis-report.component.html',
    styleUrls: ['./analysis-report.component.scss']
})
export class AnalysisReportComponent implements OnInit {

    private _editorConfig: QuillConfiguration;

    @ViewChild('quill')
    set quillEditor(qe: QuillEditorComponent) {
        this._historicalReportService.quillEditor = qe;
    }

    constructor(private _historicalReportService: HistoricalReportService) {
    }

    ngOnInit() {
        this.editorContent = '';
        this.editorConfig = QuillConfiguration.getInstance();
    }

    get editorConfig(): QuillConfiguration {
        return this._editorConfig;
    }

    set editorConfig(value: QuillConfiguration) {
        this._editorConfig = value;
    }

    get editorContent(): string {
        return this._historicalReportService.editorContent;
    }

    set editorContent(value: string) {
        this._historicalReportService.editorContent = value;
    }

}
