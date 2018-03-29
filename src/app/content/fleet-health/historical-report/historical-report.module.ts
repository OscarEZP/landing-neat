import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {SharedModule} from '../../../shared/shared.module';
import {HistoricalReportComponent} from './historical-report.component';
import {TimelineTooltipComponent} from './timeline-tooltip/timeline-tooltip.component';
import {AtaCorrectionComponent} from './ata-correction/ata-correction.component';
import {TimelineReportComponent} from './timeline-report/timeline-report.component';
import {MomentModule} from 'angular2-moment';
import {AnalysisReportComponent} from './analysis-report/analysis-report.component';
import {HistoricalTaskComponent} from './historical-task/historical-task.component';
import {NgxEditorModule} from 'ngx-editor';

@NgModule({
    imports: [
        BrowserModule,
        SharedModule,
        MomentModule,
        NgxEditorModule
    ],
    declarations: [
        TimelineReportComponent,
        HistoricalReportComponent,
        TimelineTooltipComponent,
        AtaCorrectionComponent,
        AnalysisReportComponent,
        HistoricalTaskComponent
    ],
    exports: [
        TimelineReportComponent,
        HistoricalReportComponent,
        TimelineTooltipComponent,
        AtaCorrectionComponent
    ],
    providers: [
    ],
    entryComponents: [
        HistoricalReportComponent
    ]
})

export class HistoricalReportModule {
}
