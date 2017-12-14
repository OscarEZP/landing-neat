import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StorageService } from '../shared/_services/storage.service';
import { SharedModule } from '../shared/shared.module';
import { SimplifiedLayoutComponent } from './simplified-layout.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule
    ],
    exports: [

    ],
    declarations: [
        SimplifiedLayoutComponent
    ],
    providers: [
        StorageService
    ]
})

export class SimplifiedLayoutModule {

}
