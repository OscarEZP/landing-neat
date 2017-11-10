import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {HttpModule} from "@angular/http";

// Modules
import {AuthModule} from './auth/auth.module';
import {ContentModule} from './content/content.module';
import {LayoutModule} from './layout/layout.module';
import {AppRoutingModule} from "./app-routing.module";

// Components
import {AppComponent} from './app.component';

// Services
import {AuthService} from './auth/_services/auth.service';
import {AuthGuardService} from "./auth/_services/authGuard.service";
import {DatetimeService} from "./commons/datatime.service/datetime.service";

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
      AppRoutingModule
  ],
  providers: [
      AuthService,
      AuthGuardService,
      DatetimeService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
