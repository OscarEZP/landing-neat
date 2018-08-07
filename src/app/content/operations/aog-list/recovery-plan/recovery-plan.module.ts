import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RecoveryStagesComponent} from './recovery-stages/recovery-stages.component';
import {RecoveryPlanComponent} from './recovery-plan.component';
import {SharedModule} from '../../../../shared/shared.module';
import {RecoveryRealPlanComponent} from './recovery-real-plan/recovery-real-plan.component';
import {KonvaModule} from 'ng2-konva';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        KonvaModule
    ],
    declarations: [
        RecoveryStagesComponent,
        RecoveryPlanComponent,
        RecoveryRealPlanComponent
    ]
})
export class RecoveryPlanModule {
}
