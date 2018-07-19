import {AogFormComponent} from './aog-form.component';
import {ComponentFixture, inject, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../../shared/shared.module';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DialogService} from '../../_services/dialog.service';
import {DatetimeService} from '../../../shared/_services/datetime.service';
import {ApiRestService} from '../../../shared/_services/apiRest.service';
import {MessageService} from '../../../shared/_services/message.service';
import {ClockService} from '../../../shared/_services/clock.service';
import {StorageService} from '../../../shared/_services/storage.service';
import {DataService} from '../../../shared/_services/data.service';
import {ContingencyService} from '../../_services/contingency.service';
import {LogService} from '../../_services/log.service';
import {TranslationService} from '../../../shared/_services/translation.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('Contingency List Test', () => {

    let aogFormComponent: AogFormComponent;
    let fixture: ComponentFixture<AogFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                SharedModule,
                RouterTestingModule,
                HttpClientTestingModule,
                BrowserAnimationsModule
            ],
            providers: [
                DialogService,
                DatetimeService,
                ApiRestService,
                MessageService,
                ClockService,
                StorageService,
                DataService,
                ContingencyService,
                LogService,
                TranslationService
            ],
            declarations: [AogFormComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AogFormComponent);
        aogFormComponent = fixture.componentInstance;
    });

    it('Component should be load', () => {
        expect(aogFormComponent).toBeDefined();
    });

});
