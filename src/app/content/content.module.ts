import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OperationsModule } from './operations/operations.module';
import { FleetHealthModule } from './fleet-health/fleet-health.module';
import {ManagementModule} from './management/management.module';


@NgModule({
    imports: [
        CommonModule,
        OperationsModule,
        FleetHealthModule,
        SharedModule,
        ManagementModule
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
