import { NgModule } from '@angular/core';
import { MaterialModule } from './modules/material.module';
import {CountdownComponent} from "./components/countdown.component/countdown.component";

@NgModule({
    declarations: [
        CountdownComponent
    ],
    imports: [
        MaterialModule
    ],
    exports: [
        MaterialModule,
        CountdownComponent
    ],
    providers: [

    ]
})

export class SharedModule { }
