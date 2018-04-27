import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {UserManagementComponent} from './user-management.component';
import {SharedModule} from '../../../../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        RouterModule
    ],
    declarations: [
        UserManagementComponent
    ]
})
export class UserManagementModule {
}
