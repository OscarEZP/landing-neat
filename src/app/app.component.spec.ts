import {TestBed, async} from '@angular/core/testing';
import {LayoutComponent} from './layout/layout.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthModule} from './auth/auth.module';
import {ContentModule} from './content/content.module';
import {LayoutModule} from './layout/layout.module';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {DatetimeService} from './shared/_services/datetime.service';
import {DataService} from './shared/_services/data.service';
import {APP_BASE_HREF} from '@angular/common';
import {ScrollToService} from '@nicky-lenaers/ngx-scroll-to';

describe('LayoutComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                AuthModule,
                ContentModule,
                LayoutModule,
                AppRoutingModule,
            ],
            declarations: [
                AppComponent
            ],
            providers: [
                DatetimeService,
                DataService,
                { provide: APP_BASE_HREF, useValue: '/' },
                ScrollToService
            ],
        }).compileComponents();
    }));
    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(LayoutComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

});
