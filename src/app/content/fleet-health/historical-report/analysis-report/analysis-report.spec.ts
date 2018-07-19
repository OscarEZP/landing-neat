import {AnalysisReportComponent} from './analysis-report.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../../shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {QuillModule} from 'ngx-quill';
import {HistoricalReportService} from '../_services/historical-report.service';
import {TranslationService} from '../../../../shared/_services/translation.service';
import {MessageService} from '../../../../shared/_services/message.service';

describe('Analysis Report Test', () => {

    let analysisReportComponent: AnalysisReportComponent;
    let fixture: ComponentFixture<AnalysisReportComponent>;

    const MockHistoricalReportService = {
        editorContent: ''
    };

    const MockTranslationService = {
        translateAndShow: () => new Promise(resolve => resolve),
        translate: () => new Promise(resolve => resolve(''))
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                SharedModule,
                RouterTestingModule,
                HttpClientTestingModule,
                BrowserAnimationsModule,
                QuillModule
            ],
            providers: [
                { provide: HistoricalReportService, useValue: MockHistoricalReportService },
                { provide: TranslationService, useValue: MockTranslationService },
                MessageService
            ],
            declarations: [
                AnalysisReportComponent
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AnalysisReportComponent);
        analysisReportComponent = fixture.componentInstance;
    });

    it('Component should be load', () => {
        expect(analysisReportComponent).toBeDefined();
    });

    it('Editor content should be ""', () => {
        expect(analysisReportComponent.editorContent).toEqual('');
    });

    it('"This text" should be copied', () => {
        document.execCommand = (action) => action === 'copy';
        expect(analysisReportComponent.copyTextToClipboard('This text')).toBeTruthy();
    });

    it('"This text" should not be copied', () => {
        document.execCommand = () => false;
        expect(analysisReportComponent.copyTextToClipboard('This text')).toBeFalsy();
    });

});
