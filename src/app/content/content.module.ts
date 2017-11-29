import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OperationsModule } from './operations/operations.module';


@NgModule({
    imports: [
        CommonModule,
        OperationsModule,
        SharedModule

    ],
    declarations: [
        DashboardComponent,
    ],
    exports: [

    ],
    providers: [

    ],
    bootstrap: []
})

export class ContentModule { }
