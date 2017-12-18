import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HttpClient, HttpHandler} from '@angular/common/http';
import {MAT_DIALOG_DATA, MAT_SNACK_BAR_DATA} from '@angular/material';

import {CloseContingencyComponent} from './close-contingency.component';
import {SharedModule} from '../../../shared/shared.module';
import {DialogService} from '../../_services/dialog.service';
import {TranslateService} from '@ngx-translate/core';
import {StorageService} from '../../../shared/_services/storage.service';
import {ContingencyService} from '../_services/contingency.service';
import {MessageService} from '../../../shared/_services/message.service';
import {DataService} from '../../../shared/_services/data.service';
import {LogService} from '../_services/log.service';

import {Aircraft} from '../../../shared/_models/aircraft';
import {Flight} from '../../../shared/_models/flight';
import {TimeInstant} from '../../../shared/_models/timeInstant';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('CloseContingencyComponent', () => {
    let component: CloseContingencyComponent;
    let fixture: ComponentFixture<CloseContingencyComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                SharedModule,
                BrowserAnimationsModule
            ],
            declarations: [CloseContingencyComponent],
            providers: [
                DialogService,
                TranslateService,
                StorageService,
                ContingencyService,
                MessageService,
                DataService,
                HttpClient,
                HttpHandler,
                LogService,
                {provide: MAT_SNACK_BAR_DATA, useValue: {}},
                {provide: MAT_DIALOG_DATA, useValue: {}}
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CloseContingencyComponent);
        component = fixture.componentInstance;
        component.data = {
            aircraft: new Aircraft('', '', ''),
            flight: new Flight('', '', '', new TimeInstant(0, ''))
        };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
