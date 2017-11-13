import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from "@angular/http";

// Modules
import { AccessModule } from './access/access.module';
import { ContentModule } from './content/content.module';
import { LayoutModule } from './layout/layout.module';
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';

// Services
import { AuthService } from './access/_services/auth.service';
import { DatetimeService } from "./commons/datatime.service/datetime.service";
import { DataService } from "./commons/data.service/data.service";


@NgModule({

    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpModule,
        AccessModule,
        ContentModule,
        LayoutModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        AuthService, DatetimeService, DataService
    ],
    schemas: [

    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor() {}
}
