import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ManagementComponent} from './management.component';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule} from '@angular/router';
import {UserManagementModule} from './mng-general/user-management/user-management.module';
import { UserListComponent } from './mng-general/user-list/user-list.component';
import {AtecFilterComponent} from "./mng-fleet-health/atec-filter/atec-filter.component";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule,
        UserManagementModule
    ],
    declarations: [
        ManagementComponent,
        UserListComponent,
        AtecFilterComponent
    ]
})
export class ManagementModule {
}
