import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ContingencyListComponent} from './contingency-list.component';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from '../../../shared/shared.module';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {DataService} from '../../../shared/_services/data.service';
import {MessageService} from '../../../shared/_services/message.service';
import {DetailsService} from '../../../details/_services/details.service';
import {ScrollToService} from '@nicky-lenaers/ngx-scroll-to';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('ContingencyListComponent', () => {
    let component: ContingencyListComponent;
    let fixture: ComponentFixture<ContingencyListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule,
                SharedModule,
                HttpModule,
                HttpClientModule,
                BrowserAnimationsModule
            ],
            declarations: [ContingencyListComponent],
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
        fixture = TestBed.createComponent(ContingencyListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
