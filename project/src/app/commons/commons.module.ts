import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountdownComponent } from '../commons/countdown.component/countdown.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        CountdownComponent
    ],
    exports: [
        CountdownComponent
    ]
})
export class CommonsModule { }
