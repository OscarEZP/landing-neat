import {NgModule} from "@angular/core";
import {CommonsModule} from "../../commons/commons.module";
import {
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
    MatTabsModule
} from "@angular/material";
import {ContingencesComponent} from "./contingences.component";
import {ContingenceListComponent} from './contingenceList.component/contingenceList.component';
import {BrowserModule} from "@angular/platform-browser";
import {ObjNgForPipe} from "../../commons/objNgForPipe.pipe";
import {CountdownComponent} from "../../commons/countdown.component/countdown.component";

@NgModule({
    imports: [
        BrowserModule,
        CommonsModule,
        MatTabsModule,
        MatListModule,
        MatProgressBarModule,
        MatIconModule,
        MatButtonModule,
        MatButtonToggleModule
    ],
    declarations: [ ContingencesComponent, ContingenceListComponent, ObjNgForPipe, CountdownComponent ]
})

export class ContingencesModule {}