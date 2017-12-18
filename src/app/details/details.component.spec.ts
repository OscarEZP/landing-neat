import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DetailsComponent} from './details.component';
import {SharedModule} from "../shared/shared.module";
import {InformationComponent} from "./information/information.component";
import {FollowUpComponent} from "./follow-up/follow-up.component";
import {CommentsComponent} from "./comments/comments.component";
import {TimelineComponent} from "./timeline/timeline.component";
import {DetailsService} from "./_services/details.service";
import {ScrollToService} from "@nicky-lenaers/ngx-scroll-to";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('DetailsComponent', () => {
    let component: DetailsComponent;
    let fixture: ComponentFixture<DetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule,
                BrowserAnimationsModule
            ],
            declarations: [
                DetailsComponent,
                InformationComponent,
                FollowUpComponent,
                CommentsComponent,
                TimelineComponent
            ],
            providers : [
                DetailsService,
                ScrollToService
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
