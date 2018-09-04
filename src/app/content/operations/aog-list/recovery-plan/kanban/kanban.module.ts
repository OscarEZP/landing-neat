import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../../../shared/shared.module';
import {RecoveryPlanService} from '../_services/recovery-plan.service';
import {KanbanComponent} from './kanban.component';
import {KanbanCardComponent} from './kanban-card/kanban-card.component';
import {DragulaService} from 'ng2-dragula';
import {KanbanService} from './_services/kanban.service';

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    declarations: [
        KanbanComponent,
        KanbanCardComponent
    ],
    exports: [
        KanbanComponent
    ],
    providers: [
        RecoveryPlanService,
        DragulaService,
        KanbanService
    ],
    entryComponents: [
    ]
})
export class KanbanModule {
}
