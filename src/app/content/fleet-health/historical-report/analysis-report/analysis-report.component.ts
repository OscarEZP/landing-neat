import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HistoricalReportService} from '../_services/historical-report.service';
import {QuillEditorComponent} from 'ngx-quill';
import {QuillConfiguration} from '../../../../shared/_models/components/quillConfiguration';
import {TranslationService} from '../../../../shared/_services/translation.service';

@Component({
    selector: 'lsl-analysis-report',
    templateUrl: './analysis-report.component.html',
    styleUrls: ['./analysis-report.component.scss']
})
export class AnalysisReportComponent implements OnInit, AfterViewInit {

    private static SUCCESS_TEXT = 'FLEET_HEALTH.REPORT.MSG.TEXT_COPIED';
    private static ERROR_TEXT = 'FLEET_HEALTH.REPORT.MSG.TEXT_NOT_COPIED';
    private static COPY_TO_CLIPBOARD_LABEL = 'FLEET_HEALTH.REPORT.COPY_TO_CLIPBOARD';

    private _editorConfig: QuillConfiguration;

    @ViewChild('quill')
    set quillEditor(qe: QuillEditorComponent) {
        this._historicalReportService.quillEditor = qe;
    }

    constructor(
        private _historicalReportService: HistoricalReportService,
        private _translationService: TranslationService,
        private _el: ElementRef
    ) {
    }

    ngOnInit() {
        this.editorContent = '';
        this.editorConfig = QuillConfiguration.getInstance();
        this.htmlCallback = () => {
            const message = this.copyTextToClipboard(this.editorContent) ?
                AnalysisReportComponent.SUCCESS_TEXT :
                AnalysisReportComponent.ERROR_TEXT;
            this._translationService.translateAndShow(message, 2500);
        };
    }

    /**
     * The 'Copy to clipboard' label must be created after render process
     */
    ngAfterViewInit() {
        const el = this._el.nativeElement.querySelector('.ql-html');
        this._translationService.translate(AnalysisReportComponent.COPY_TO_CLIPBOARD_LABEL)
            .then(res => el.innerHTML = res + '<i class="material-icons">file_copy</i>');
    }

    /**
     * Copy a text to clipboard
     * @param text
     */
    public copyTextToClipboard(text): boolean {
        let result = false;
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            if (document.execCommand('copy')) {
                result = true;
            }
        } catch (err) { console.log(err); }
        document.body.removeChild(textArea);
        return result;
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
