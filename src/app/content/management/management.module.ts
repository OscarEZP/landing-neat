import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ManagementComponent} from './management.component';
import {SharedModule} from '../../shared/shared.module';
import { AtecFilterComponent } from './atec-filter/atec-filter.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { EmailMaintainerComponent } from './email-maintainer/email-maintainer.component';
import {RouterModule} from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule
    ],
    declarations: [
        ManagementComponent,
        AtecFilterComponent,
        UserManagementComponent,
        EmailMaintainerComponent,
    ]
})
export class ManagementModule {
}
