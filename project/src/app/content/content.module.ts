import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard.component/dashboard.component';
import {OperationsComponent} from "./operations/operations.component";
import {ContingenceListComponent} from "./operations/contingenceList.component/contingenceList.component";
import {CountdownComponent} from "../commons/countdown.component/countdown.component";
import {ObjNgForPipe} from "../commons/objNgForPipe.pipe";
import {SharedModule} from "../shared/shared.module";

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    declarations: [
        DashboardComponent,
        OperationsComponent,
        ContingenceListComponent,
        ObjNgForPipe,
        CountdownComponent
    ],
    bootstrap: []
})
export class ContentModule {
}
