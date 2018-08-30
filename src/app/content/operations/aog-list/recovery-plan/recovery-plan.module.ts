import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RecoveryStagesComponent} from './recovery-stages/recovery-stages.component';
import {RecoveryPlanComponent} from './recovery-plan.component';
import {SharedModule} from '../../../../shared/shared.module';
import {RecoveryRealPlanComponent} from './recovery-real-plan/recovery-real-plan.component';
import {KonvaModule} from 'ng2-konva';
import {RecoverySlotsComponent} from './recovery-slots/recovery-slots.component';
import {ShapeDraw} from './util/shapeDraw';
import { AddStageFormComponent } from './recovery-stages/add-stage-form/add-stage-form.component';
import {TimeConverter} from './util/timeConverter';
import {RecoveryPlanService} from './_services/recovery-plan.service';
import { RecoveryZoomComponent } from './recovery-zoom/recovery-zoom.component';
import { FollowUpAogModalComponent } from './follow-up-aog-modal/follow-up-aog-modal.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        KonvaModule
    ],
    declarations: [
        RecoveryStagesComponent,
        RecoveryPlanComponent,
        RecoveryRealPlanComponent,
        RecoverySlotsComponent,
        RecoveryZoomComponent,
        AddStageFormComponent,
        RecoveryZoomComponent,
        FollowUpAogModalComponent
    ],
    providers: [
        TimeConverter,
        ShapeDraw,
        RecoveryPlanService
    ],
    entryComponents: [
        AddStageFormComponent,
        FollowUpAogModalComponent
    ]
})
export class RecoveryPlanModule {
}
