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
import { CancelComponent } from './cancel/cancel.component';
import { CloseContingencyComponent } from './close-contingency/close-contingency.component';
import { ContingencyFormComponent } from './create-contingency/create-contingency.component';
import { ContingencyListComponent } from './contingency-list/contingency-list.component';
import { ContingencySimplifiedListComponent } from './contingency-simplified-list/contingency-simplified-list.component';
import { OperationsComponent } from './operations.component';
import { PitStopListComponent } from './pit-stop-list/pit-stop-list.component';
import { SearchHistoricalComponent } from './search-historical/search-historical.component';
import { EssComponent } from './ess/ess.component';
import { MeetingComponent } from './meeting/meeting.component';
import {PendingListComponent} from './pending-list/pending-list.component';
import {ResolvePendingComponent} from './resolve-pending/resolve-pending.component';

@NgModule({
    imports: [
        BrowserModule,
        SharedModule,
        RouterModule
    ],
    declarations: [
        OperationsComponent,
        ContingencyListComponent,
        ContingencySimplifiedListComponent,
        ContingencyFormComponent,
        CancelComponent,
        CloseContingencyComponent,
        SearchHistoricalComponent,
        PitStopListComponent,
        EssComponent,
        MeetingComponent,
        PendingListComponent,
        ResolvePendingComponent
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
        CancelComponent,
        CloseContingencyComponent,
        MeetingComponent,
        ResolvePendingComponent
    ]
})

export class OperationsModule {
}
