import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { AppRoutingModule } from './app-routing.module';
// Components
import { AppComponent } from './app.component';
// Modules
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { DetailsModule } from './details/details.module';
import { LayoutModule } from './layout/layout.module';
import { DataService } from './shared/_services/data.service';
// Services
import { DatetimeService } from './shared/_services/datetime.service';
import { SimplifiedLayoutModule } from './simplified-layout/simplified-layout.module';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({

    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpModule,
        AuthModule,
        ContentModule,
        LayoutModule,
        SimplifiedLayoutModule,
        AppRoutingModule,
        HttpClientModule,
        DetailsModule,
        ScrollToModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        DatetimeService,
        DataService
    ],
    schemas: [],
    bootstrap: [AppComponent]
})

export class AppModule { }
