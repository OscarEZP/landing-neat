import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../../shared/shared.module';

import { OperationsComponent } from './operations.component';
import { ContingencyListComponent } from './contingency-list.component/contingency-list.component';
import { ContingencyFormComponent } from './contingency-form/contingency-form.component';
import { DialogService } from '../_services/dialog.service';
import { ContingencyService } from './_services/contingency.service';
import { LogService } from './_services/log.service';

@NgModule({
    imports: [
        BrowserModule,
        SharedModule
    ],
    declarations: [
        OperationsComponent,
        ContingencyListComponent,
        ContingencyFormComponent
    ],
    exports: [

    ],
    providers: [
        DialogService,
        ContingencyService,
        LogService
    ]
})

export class OperationsModule { }
