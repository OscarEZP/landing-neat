import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OperationsModule } from './operations/operations.module';
import { FleetHealthModule } from './fleet-health/fleet-health.module';
import {ManagementModule} from './management/management.module';
import {TimeService} from '../shared/_services/timeService';


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
        TimeService
    ],
    bootstrap: []
})

export class ContentModule { }
