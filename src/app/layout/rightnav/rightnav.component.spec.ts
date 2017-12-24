import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RightnavComponent} from './rightnav.component';
import {SharedModule} from "../../shared/shared.module";
import {DetailsService} from "../../details/_services/details.service";
import {ScrollToService} from "@nicky-lenaers/ngx-scroll-to";

describe('RightnavComponent', () => {
    let component: RightnavComponent;
    let fixture: ComponentFixture<RightnavComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule
            ],
            declarations: [
                RightnavComponent
            ],
            providers: [
                DetailsService,
                ScrollToService
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RightnavComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
