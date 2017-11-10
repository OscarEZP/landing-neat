import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login.component/login.component';

// import {AuthService} from "./_services/auth.service";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ LoginComponent ],
  providers: []
})
export class AuthModule { }
