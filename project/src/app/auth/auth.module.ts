import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AuthService} from './_services/auth.service';
import {RecoverPasswordService} from './_services/recoverPassword.service';
import {AuthGuardService} from './_services/authGuard.service';
import {LoginComponent} from './login/login.component';
import {FindAccountComponent} from './find-account/find-account.component';
import {RecoverPasswordComponent} from './recover-password/recover-password.component';
import {HttpModule}    from '@angular/http';
import {MessageService} from "../shared/_services/message.service";
import {StorageService} from "../shared/_services/storage.service";
import {RoutingService} from "../shared/_services/routing.service";

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        HttpModule
    ],
    declarations: [LoginComponent, FindAccountComponent, RecoverPasswordComponent],
    providers: [
        AuthService,
        AuthGuardService,
        RecoverPasswordService,
        MessageService,
        StorageService,
        RoutingService
    ]
})
export class AuthModule {
}
