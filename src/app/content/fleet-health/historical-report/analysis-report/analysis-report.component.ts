import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HistoricalReportService} from '../_services/historical-report.service';
import {QuillEditorComponent} from 'ngx-quill';
import {QuillConfiguration} from '../../../../shared/_models/components/quillConfiguration';
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from '../../../../shared/_services/message.service';

@Component({
    selector: 'lsl-analysis-report',
    templateUrl: './analysis-report.component.html',
    styleUrls: ['./analysis-report.component.scss']
})
export class AnalysisReportComponent implements OnInit {

    private static SUCCESS_TEXT = 'FLEET_HEALTH.REPORT.MSG.TEXT_COPIED';
    private static ERROR_TEXT = 'FLEET_HEALTH.REPORT.MSG.TEXT_NOT_COPIED';

    private _editorConfig: QuillConfiguration;

    @ViewChild('quill')
    set quillEditor(qe: QuillEditorComponent) {
        this._historicalReportService.quillEditor = qe;
    }

    constructor(
        private _historicalReportService: HistoricalReportService,
        private _translateService: TranslateService,
        private _messageService: MessageService,
        private _el: ElementRef
    ) {
        console.log(this._el.nativeElement.querySelector('.ql-html'));
    }

    ngOnInit() {
        this.editorContent = '';
        this.editorConfig = QuillConfiguration.getInstance();
        this.htmlCallback = () => this.copyTextToClipboard(this.editorContent);
    }

    private copyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            if (document.execCommand('copy')) {
                this.translateString(AnalysisReportComponent.SUCCESS_TEXT);
            } else {
                this.translateString(AnalysisReportComponent.ERROR_TEXT);
            }
        } catch (err) {
            this.translateString(AnalysisReportComponent.ERROR_TEXT);
        }
        document.body.removeChild(textArea);
    }

    private translateString(toTranslate: string): void {
        this._translateService.get(toTranslate)
            .toPromise()
            .then((res: string) => this._messageService.openSnackBar(res, 2500));
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

    set htmlCallback(value: object) {
        this.editorConfig.htmlHandler = value;
    }

}
