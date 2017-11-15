import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../../shared/shared.module';

import { OperationsComponent } from './operations.component';
import { ContingencyListComponent } from './contingency-list.component/contingency-list.component';
import { ContingenceFormComponent } from './contingence-form/contingence-form.component';


@NgModule({
    imports: [
        BrowserModule,
        SharedModule
    ],
    declarations: [
        OperationsComponent,
        ContingencyListComponent,
        ContingenceFormComponent
    ],
    exports: [
        ContingencyListComponent,
        ContingenceFormComponent
    ]
})

export class OperationsModule { }
