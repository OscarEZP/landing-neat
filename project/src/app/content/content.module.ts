import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ObjNgForPipe } from '../commons/objNgForPipe.pipe';
import { OperationsModule } from './operations/operations.module';

@NgModule({
    imports: [
        CommonModule,
        OperationsModule,
    ],
    declarations: [
        DashboardComponent,
        ObjNgForPipe
    ],
    exports: [

    ],
    providers: [
        
    ],
    bootstrap: []
})

export class ContentModule {}
