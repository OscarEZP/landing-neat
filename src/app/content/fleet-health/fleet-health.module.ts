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
import {HistoricalReportModule} from './historical-report/historical-report.module';
import {FleetHealthService} from './_services/fleet-health.service';

@NgModule({
    imports: [
        BrowserModule,
        SharedModule,
        RouterModule,
        HistoricalReportModule
    ],
    declarations: [
        FleetHealthComponent,
        DeferralListComponent,
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
        DateUtil,
        FleetHealthService
    ],
    entryComponents: [
    ]
})

export class FleetHealthModule {
}
