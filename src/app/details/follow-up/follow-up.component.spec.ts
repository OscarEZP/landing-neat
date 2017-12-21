import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FollowUpComponent} from './follow-up.component';
import {SharedModule} from "../../shared/shared.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('FollowUpComponent', () => {
    let component: FollowUpComponent;
    let fixture: ComponentFixture<FollowUpComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule,
                BrowserAnimationsModule
            ],
            declarations: [FollowUpComponent]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FollowUpComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
