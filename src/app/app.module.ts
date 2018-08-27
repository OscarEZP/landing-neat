import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { AppRoutingModule } from './app-routing.module';
import {DragulaModule, DragulaService} from 'ng2-dragula';

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
import {TranslationService} from './shared/_services/translation.service';

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
        DragulaModule.forRoot(),
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
        DataService,
        TranslationService,
        DragulaService
    ],
    schemas: [],
    bootstrap: [AppComponent]
})

export class AppModule { }
