import { NgModule } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {SharedModule} from '../../../shared/shared.module';
import {HistoricalReportComponent} from './historical-report.component';
import {TimelineTooltipComponent} from './timeline-tooltip/timeline-tooltip.component';
import {AtaCorrectionComponent} from './ata-correction/ata-correction.component';
import {TimelineReportComponent} from './timeline-report/timeline-report.component';

@NgModule({
    imports: [
        BrowserModule,
        SharedModule,
    ],
    declarations: [
        TimelineReportComponent,
        HistoricalReportComponent,
        TimelineTooltipComponent,
        AtaCorrectionComponent
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
