import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from "../shared/shared.module";
import {FormsModule} from "@angular/forms";

import {AuthService} from "./_services/auth.service";
import {AuthGuardService} from "./_services/authGuard.service";

import {LoginComponent} from './login.component/login.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FormsModule
    ],
    declarations: [LoginComponent],
    providers: [
        AuthService,
        AuthGuardService
    ]
})
export class AuthModule { }
