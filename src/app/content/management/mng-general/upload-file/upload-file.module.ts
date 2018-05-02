import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../../../shared/shared.module';
import {UploadFileComponent} from "./upload-file.component";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule
    ],
    declarations: [
        UploadFileComponent
    ]
})
export class UploadFileModule {
}