import {Component, OnInit, ViewChild} from '@angular/core';
import {HistoricalReportService} from '../_services/historical-report.service';
import {QuillEditorComponent} from 'ngx-quill';

@Component({
    selector: 'lsl-analysis-report',
    templateUrl: './analysis-report.component.html',
    styleUrls: ['./analysis-report.component.scss']
})
export class AnalysisReportComponent implements OnInit {

    private _editorConfig: object;

    @ViewChild('quill')
    set quillEditor(qe: QuillEditorComponent) {
        this._historicalReportService.quillEditor = qe;
    }

    constructor(private _historicalReportService: HistoricalReportService) {
    }

    ngOnInit() {
        this.editorContent = '';
        this.editorConfig = {
            'style': {'height': '250px'},
            'placeholder': 'Enter text here...',
            'readOnly': false,
            'theme': 'snow',
            'modules': {
                toolbar: [
                    ['bold', 'italic', 'underline'],            // toggled buttons
                    [{'list': 'ordered'}, {'list': 'bullet'}],
                    [{'indent': '-1'}, {'indent': '+1'}],       // outdent/indent

                    [{'color': []}, {'background': []}],        // dropdown with defaults from theme
                    [{'align': []}],

                    ['clean']                                   // remove formatting button
                ]
            }
        };
    }

    get editorConfig(): object {
        return this._editorConfig;
    }

    set editorConfig(value: object) {
        this._editorConfig = value;
    }

    get editorContent(): string {
        return this._historicalReportService.editorContent;
    }

    set editorContent(value: string) {
        this._historicalReportService.editorContent = value;
    }

}
