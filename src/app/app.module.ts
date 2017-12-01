import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

// Modules
import { AuthModule } from './auth/auth.module';
import { ContentModule } from './content/content.module';
import { LayoutModule } from './layout/layout.module';
import { AppRoutingModule } from './app-routing.module';
import { DetailsModule } from './details/details.module';

// Components
import { AppComponent } from './app.component';
// Services
import { DatetimeService } from './shared/_services/datetime.service';
import { DataService } from './shared/_services/data.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

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
        AppRoutingModule,
        HttpClientModule,
        DetailsModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
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
