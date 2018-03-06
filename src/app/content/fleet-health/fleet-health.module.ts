import { NgModule } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ApiRestService } from '../../shared/_services/apiRest.service';
import { ClockService } from '../../shared/_services/clock.service';
import { SharedModule } from '../../shared/shared.module';
import { DateUtil } from '../../shared/util/dateUtil';
import { DialogService } from '../_services/dialog.service';
import { ContingencyService } from '../_services/contingency.service';
import { HistoricalSearchService } from '../_services/historical-search.service';
import { InfiniteScrollService } from '../_services/infinite-scroll.service';
import { LogService } from '../_services/log.service';
import { FleetHealthComponent } from './fleet-health.component';
import { DeferralListComponent } from './deferral-list/deferral-list.component';
import { TimelineComponent } from './timeline/timeline.component';
import { HistoricalReportComponent } from './historical-report/historical-report.component';
import { TimelineTooltipComponent } from './timeline-tooltip/timeline-tooltip.component';

@NgModule({
    imports: [
        BrowserModule,
        SharedModule,
        RouterModule
    ],
    declarations: [
        FleetHealthComponent,
        DeferralListComponent,
        TimelineComponent,
        HistoricalReportComponent,
        TimelineTooltipComponent
    ],
    exports: [],
    providers: [
        DialogService,
        ContingencyService,
        LogService,
        ClockService,
        ApiRestService,
        InfiniteScrollService,
        HistoricalSearchService,
        {provide: MAT_DATE_LOCALE, useValue: 'es-CL'},
        DateUtil
    ],
    entryComponents: [
        HistoricalReportComponent,
        TimelineTooltipComponent
    ]
})

export class FleetHealthModule {
}
