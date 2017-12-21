import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LayoutComponent} from './layout.component';
import {SharedModule} from "../shared/shared.module";
import {ToolbarComponent} from "./toolbar/toolbar.component";
import {SidenavComponent} from "./sidenav/sidenav.component";
import {RightnavComponent} from "./rightnav/rightnav.component";
import {AppRoutingModule} from "../app-routing.module";
import {ContentModule} from "../content/content.module";
import {AuthModule} from "../auth/auth.module";
import {DetailsModule} from "../details/details.module";
import {APP_BASE_HREF} from "@angular/common";
import {SidenavService} from "./_services/sidenav.service";
import {ScrollToService} from "@nicky-lenaers/ngx-scroll-to";
import {DataService} from "../shared/_services/data.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {DatetimeService} from "../shared/_services/datetime.service";

describe('LayoutComponent', () => {
    let component: LayoutComponent;
    let fixture: ComponentFixture<LayoutComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule,
                AppRoutingModule,
                ContentModule,
                AuthModule,
                DetailsModule,
                BrowserAnimationsModule
            ],
            declarations: [
                ToolbarComponent,
                LayoutComponent,
                SidenavComponent,
                RightnavComponent
            ],
            providers:[
                { provide: APP_BASE_HREF, useValue: '/' },
                SidenavService,
                ScrollToService,
                DataService,
                DatetimeService
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LayoutComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
