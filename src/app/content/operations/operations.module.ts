import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../../shared/shared.module';

import { OperationsComponent } from './operations.component';
import { ContingencyListComponent } from './contingency-list.component/contingency-list.component';
import { ContingencyFormComponent } from './contingency-form/contingency-form.component';
import { DialogService } from '../_services/dialog.service';

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
        DialogService
    ]
})

export class OperationsModule { }
