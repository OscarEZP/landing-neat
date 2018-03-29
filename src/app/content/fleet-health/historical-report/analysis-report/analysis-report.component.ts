import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'lsl-analysis-report',
    templateUrl: './analysis-report.component.html',
    styleUrls: ['./analysis-report.component.css']
})
export class AnalysisReportComponent implements OnInit {

    constructor() {
    }

    private _editorConfig: object;

    get editorConfig(): object {
        return this._editorConfig;
    }

    set editorConfig(value: object) {
        this._editorConfig = value;
    }

    private _editorContent: string;

    get editorContent(): string {
        return this._editorContent;
    }

    set editorContent(value: string) {
        this._editorContent = value;
    }

    ngOnInit() {

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
}
