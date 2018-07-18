import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
export class AnalysisReportComponent implements OnInit, AfterViewInit {

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
    }

    ngOnInit() {
        this.editorContent = '';
        this.editorConfig = QuillConfiguration.getInstance();
        this.htmlCallback = () => this.copyTextToClipboard(this.editorContent);
    }

    /**
     * The 'Copy to clipboard' label must be created after render process
     */
    ngAfterViewInit() {
        const el = this._el.nativeElement.querySelector('.ql-html');
        this.translate('FLEET_HEALTH.REPORT.COPY_TO_CLIPBOARD')
            .then(res => el.innerHTML = res + '<i class="material-icons">file_copy</i>');
    }

    /**
     * Copy a text to clipboard
     * @param text
     */
    private copyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            if (document.execCommand('copy')) {
                this.translateAndShow(AnalysisReportComponent.SUCCESS_TEXT);
            } else {
                this.translateAndShow(AnalysisReportComponent.ERROR_TEXT);
            }
        } catch (err) {
            this.translateAndShow(AnalysisReportComponent.ERROR_TEXT);
        }
        document.body.removeChild(textArea);
    }

    /**
     * Translate a message
     * @param {string} toTranslate
     * @returns {Promise<string>}
     */
    private translate(toTranslate: string): Promise<string> {
        return this._translateService.get(toTranslate).toPromise();
    }

    /**
     * Translate and show a toast with a message
     * @param {string} toTranslate
     */
    private translateAndShow(toTranslate: string): void {
        this.translate(toTranslate).then((res: string) => this._messageService.openSnackBar(res, 2500));
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
