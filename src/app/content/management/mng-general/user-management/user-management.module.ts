import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {UserManagementComponent} from './user-management.component';
import {SharedModule} from '../../../../shared/shared.module';
import {UserListComponent} from './user-list/user-list.component';
import {BulkLoadComponent} from './bulk-load/bulk-load.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule
    ],
    declarations: [
        UserManagementComponent,
        UserListComponent,
        BulkLoadComponent
    ]
})
export class UserManagementModule {
}
