import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

// Modules
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { LayoutModule } from './layout/layout.module';
import { AppRoutingModule } from './app-routing.module';

// Components
import { AppComponent } from './app.component';

// Services
import { DatetimeService } from './shared/_services/datetime.service';
import { DataService } from './shared/_services/data.service';

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
        DatetimeService,
        DataService
    ],
    schemas: [

    ],
    bootstrap: [AppComponent]
})

export class AppModule { }

