import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {SharedModule} from '../../shared/shared.module';

import {OperationsComponent} from './operations.component';
import {ContingencyListComponent} from './contingency-list.component/contingency-list.component';
import {ContingencyFormComponent} from './contingency-form/contingency-form.component';
import {DialogService} from '../_services/dialog.service';
import {ContingencyService} from './_services/contingency.service';
import {LogService} from './_services/log.service';
import {ClockService} from '../../shared/_services/clock.service';
import {CancelComponent} from './cancel/cancel.component';

@NgModule({
    imports: [
        BrowserModule,
        SharedModule
    ],
    declarations: [
        OperationsComponent,
        ContingencyListComponent,
        ContingencyFormComponent,
        CancelComponent
    ],
    exports: [],
    providers: [
        DialogService,
        ContingencyService,
        LogService,
        ClockService
    ],
    entryComponents: [
        CancelComponent
    ]
})

export class OperationsModule {
}
