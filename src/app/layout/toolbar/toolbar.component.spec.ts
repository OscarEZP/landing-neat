import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ToolbarComponent} from './toolbar.component';
import {SharedModule} from "../../shared/shared.module";
import {DatetimeService} from "../../shared/_services/datetime.service";
import {HttpModule} from "@angular/http";
import {HttpClientModule} from "@angular/common/http";
import {DataService} from "../../shared/_services/data.service";
import {SidenavService} from "../_services/sidenav.service";
import {RoutingService} from "../../shared/_services/routing.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('ToolbarComponent', () => {
    let component: ToolbarComponent;
    let fixture: ComponentFixture<ToolbarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule,
                HttpModule,
                HttpClientModule,
                BrowserAnimationsModule
            ],
            declarations: [ToolbarComponent],
            providers: [
                DatetimeService,
                DataService,
                SidenavService,
                RoutingService
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ToolbarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
