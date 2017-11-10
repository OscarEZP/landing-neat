import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {RouterModule} from '@angular/router';

// Modules
import {AuthModule} from './auth/auth.module';
import {ContentModule} from './content/content.module';
import {LayoutModule} from './layout/layout.module';

// Components
import {AppComponent} from './app.component';

// Services
import {AuthService} from './auth/_services/auth.service';
import {AuthGuardService} from "./auth/_services/authGuard.service";

// Config
import {ROUTES} from "../config/routing";

@NgModule({
  declarations: [ AppComponent ],
  imports : [
    BrowserModule,
    BrowserAnimationsModule,
    AuthModule,
    ContentModule,
    LayoutModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [
    AuthService,
    AuthGuardService
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
