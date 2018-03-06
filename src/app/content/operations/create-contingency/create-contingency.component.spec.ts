import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ContingencyFormComponent} from './create-contingency.component';
import {SharedModule} from '../../../shared/shared.module';
import {DialogService} from '../../_services/dialog.service';
import {ContingencyService} from '../../_services/contingency.service';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';
import {LogService} from '../../_services/log.service';
import {DatetimeService} from '../../../shared/_services/datetime.service';
import {ClockService} from '../../../shared/_services/clock.service';
import {DataService} from '../../../shared/_services/data.service';
import {MessageService} from '../../../shared/_services/message.service';
import {StorageService} from '../../../shared/_services/storage.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('ContingencyFormComponent', () => {
    let component: ContingencyFormComponent;
    let fixture: ComponentFixture<ContingencyFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                SharedModule,
                HttpClientModule,
                HttpModule
            ],
            declarations: [
                ContingencyFormComponent
            ],
            providers: [
                DialogService,
                ContingencyService,
                LogService,
                DatetimeService,
                ClockService,
                DataService,
                MessageService,
                StorageService
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContingencyFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
