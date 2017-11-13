import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component/login.component';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from './_services/auth.service';

@NgModule({
    imports: [
        CommonModule,
        SharedModule
    ],
    declarations: [LoginComponent],
    providers: [AuthService]

})
export class AccessModule {
}
