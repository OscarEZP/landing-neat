import {NgModule} from "@angular/core";
import {CommonsModule} from "../../commons/commons.module";
import {ContingenceListComponent} from './contingenceList.component/contingenceList.component';
import {BrowserModule} from "@angular/platform-browser";
import {OperationsComponent} from "./operations.component";
import {SharedModule} from "../../shared/shared.module";

@NgModule({
    imports: [
        BrowserModule,
        CommonsModule,
        SharedModule
    ],
    declarations: [
        OperationsComponent,
        ContingenceListComponent
    ]
})

export class OperationsModule {}