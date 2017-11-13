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
import {DataService} from "./commons/data.service/data.service";

@NgModule({

    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpModule,
        AuthModule,
        ContentModule,
        LayoutModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        AuthService,
        AuthGuardService,
        DatetimeService,
        DataService
    ],
    schemas: [

    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
