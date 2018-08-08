import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RecoveryStagesComponent} from './recovery-stages/recovery-stages.component';
import {RecoveryPlanViewComponent} from './recovery-plan-view/recovery-plan-view.component';
import {SharedModule} from '../../../../shared/shared.module';
import {RecoveryRealPlanComponent} from './recovery-real-plan/recovery-real-plan.component';
import {KonvaModule} from 'ng2-konva';
import {RecoverySlotsComponent} from './recovery-slots/recovery-slots.component';
import {TimeConverterService} from './util/time-converter.service';
import {ShapeDraw} from './util/shapeDraw';
import {RecoveryPlanService} from './util/recovery-plan.service';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        KonvaModule
    ],
    declarations: [
        RecoveryStagesComponent,
        RecoveryPlanViewComponent,
        RecoveryRealPlanComponent,
        RecoverySlotsComponent
    ],
    providers: [
        TimeConverterService,
        ShapeDraw,
        RecoveryPlanService
    ]
})
export class RecoveryPlanModule {
}
