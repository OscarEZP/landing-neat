import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lsl-analysis-report',
  templateUrl: './analysis-report.component.html',
  styleUrls: ['./analysis-report.component.css']
})
export class AnalysisReportComponent implements OnInit {

  constructor() { }

  private _editorConfig: object;

    get editorConfig(): object {
        return this._editorConfig;
    }

    set editorConfig(value: object) {
        this._editorConfig = value;
    }

  private _editorButtons: object;

    get editorButtons(): object {
        return this._editorButtons;
    }

    set editorButtons(value: object) {
        this._editorButtons = value;
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
            'editable' : true,
            'height' : 'auto',
            'minHeight': '0',
            'width': 'auto',
            'minWidth': '0',
            'translate': 'yes',
            'enableToolbar': true,
            'showToolbar': true,
            'placeholder': 'Enter text here...',
            'imageEndPoint': '',
            'toolbar': [
                ['bold', 'italic', 'underline', 'strikeThrough', 'superscript', 'subscript'],
                ['fontName', 'fontSize', 'color'],
                ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'indent', 'outdent'],
                ['cut', 'copy', 'delete', 'removeFormat', 'undo', 'redo'],
                ['paragraph', 'blockquote', 'removeBlockquote', 'horizontalLine', 'orderedList', 'unorderedList']
            ]
        };

        this.editorContent = '';
  }

}
