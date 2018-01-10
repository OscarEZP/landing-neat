import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OperationsComponent} from './operations.component';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from '../../shared/shared.module';
import {ContingencyListComponent} from './contingency-list/contingency-list.component';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {DataService} from '../../shared/_services/data.service';
import {MessageService} from '../../shared/_services/message.service';
import {DetailsService} from '../../details/_services/details.service';
import {ScrollService} from '../../shared/_services/scrolling.service';
import {ScrollToService} from '@nicky-lenaers/ngx-scroll-to';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('OperationsComponent', () => {
    let component: OperationsComponent;
    let fixture: ComponentFixture<OperationsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule,
                SharedModule,
                HttpModule,
                HttpClientModule,
                BrowserAnimationsModule
            ],
            declarations: [
                OperationsComponent,
                ContingencyListComponent
            ],
            providers: [
                DataService,
                MessageService,
                DetailsService,
                ScrollToService
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OperationsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
