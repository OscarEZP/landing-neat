import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HttpModule} from "@angular/http";

// Modules
import {AuthModule} from './auth/auth.module';
import {ContentModule} from './content/content.module';
import {LayoutModule} from './layout/layout.module';

// Components
import {AppComponent} from './app.component';

// Services
import {AuthService} from './auth/_services/auth.service';
import {AuthGuardService} from "./auth/_services/authGuard.service";
import {DatetimeService} from "./commons/datatime.service/datetime.service";

// Config
import {ROUTES} from "../config/routing";

@NgModule({
  declarations: [
      AppComponent
  ],
  imports : [
    BrowserModule,
    BrowserAnimationsModule,
      HttpModule,
    AuthModule,
    ContentModule,
    LayoutModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [
      AuthService,
      AuthGuardService,
      DatetimeService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
