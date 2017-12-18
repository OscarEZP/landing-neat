import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InformationComponent} from './information.component';
import {TranslateModule} from "@ngx-translate/core";
import {SharedModule} from "../../shared/shared.module";
import {DetailsService} from "../_services/details.service";
import {ScrollToService} from "@nicky-lenaers/ngx-scroll-to";

describe('InformationComponent', () => {
    let component: InformationComponent;
    let fixture: ComponentFixture<InformationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule,
                SharedModule
            ],
            declarations: [InformationComponent],
            providers: [
                DetailsService,
                ScrollToService
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InformationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
