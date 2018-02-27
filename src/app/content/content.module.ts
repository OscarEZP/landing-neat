import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OperationsModule } from './operations/operations.module';
import { FleetHealthModule } from './fleet-health/fleet-health.module';


@NgModule({
    imports: [
        CommonModule,
        OperationsModule,
        FleetHealthModule,
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
