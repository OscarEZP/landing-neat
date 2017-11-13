import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component/dashboard.component';
import { ObjNgForPipe } from "../commons/objNgForPipe.pipe";
import { SharedModule } from "../shared/shared.module";
import { OperationsModule } from './operations/operations.module'

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        OperationsModule
    ],
    declarations: [
        DashboardComponent,
        ObjNgForPipe
    ],
    exports: [
        OperationsModule
    ],
    bootstrap: []
})
export class ContentModule {
}
