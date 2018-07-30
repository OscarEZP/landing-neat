import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RecoveryStagesComponent} from './recovery-stages/recovery-stages.component';
import {RecoveryPlanViewComponent} from './recovery-plan-view/recovery-plan-view.component';
import {SharedModule} from '../../../../shared/shared.module';
import { RecoveryRealPlanComponent } from './recovery-real-plan/recovery-real-plan.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    declarations: [
        RecoveryStagesComponent,
        RecoveryPlanViewComponent,
        RecoveryRealPlanComponent
    ]
})
export class RecoveryPlanModule {
}
