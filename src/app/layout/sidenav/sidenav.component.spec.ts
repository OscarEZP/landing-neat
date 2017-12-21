import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SidenavComponent} from './sidenav.component';
import {AppRoutingModule} from "../../app-routing.module";
import {SidenavService} from "../_services/sidenav.service";
import {StorageService} from "../../shared/_services/storage.service";
import {LayoutComponent} from "../layout.component";
import {ContentModule} from "../../content/content.module";
import {LoginComponent} from "../../auth/login/login.component";
import {AuthModule} from "../../auth/auth.module";
import {SharedModule} from "../../shared/shared.module";
import {ToolbarComponent} from "../toolbar/toolbar.component";
import {RightnavComponent} from "../rightnav/rightnav.component";
import {DetailsModule} from "../../details/details.module";
import {APP_BASE_HREF} from "@angular/common";

describe('SidenavComponent', () => {
    let component: SidenavComponent;
    let fixture: ComponentFixture<SidenavComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule,
                AppRoutingModule,
                ContentModule,
                AuthModule,
                DetailsModule
            ],
            declarations: [
                ToolbarComponent,
                LayoutComponent,
                SidenavComponent,
                RightnavComponent
            ],
            providers: [
                SidenavService,
                StorageService,
                { provide: APP_BASE_HREF, useValue: '/' },
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SidenavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
