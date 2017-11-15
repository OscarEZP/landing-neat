import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AuthService} from './_services/auth.service';
import {AuthGuardService} from './_services/authGuard.service';
import {LoginComponent} from './login/login.component';
import {FindAccountComponent} from './find-account/find-account.component';
import { ChangePasswordComponent } from './change-password/change-password.component';


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule
    ],
    declarations: [LoginComponent, FindAccountComponent, ChangePasswordComponent],
    providers: [
        AuthService,
        AuthGuardService
    ]
})
export class AuthModule {
}
