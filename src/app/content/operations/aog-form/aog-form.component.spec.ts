import {AogFormComponent} from './aog-form.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
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
import {FormControl} from '@angular/forms';
import {Aircraft} from '../../../shared/_models/aircraft';

describe('AOG form test', () => {

    let aogFormComponent: AogFormComponent;
    let fixture: ComponentFixture<AogFormComponent>;

    const MockTranslationService = {
        translateAndShow: (value) => value
    };

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
                {provide: TranslationService, useValue: MockTranslationService},
            ],
            declarations: [AogFormComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AogFormComponent);
        aogFormComponent = fixture.componentInstance;
    });

    afterEach(() => {
        aogFormComponent.ngOnDestroy();
    });

    it('Component should be load', () => {
        expect(aogFormComponent).toBeDefined();
    });

    it('AOG form should be defined', () => {
        expect(aogFormComponent.aogForm).toBeDefined();
    });

    it('Duration min limit is set', () => {
        aogFormComponent.ngOnInit();
        const minLimit = aogFormComponent.arrDuration.shift();
        expect(minLimit).toEqual(30);
    });

    it('Duration max limit is set', () => {
        aogFormComponent.ngOnInit();
        const maxLimit = aogFormComponent.arrDuration.pop();
        expect(maxLimit).toEqual(1440);
    });

    it('Safety event validator: checked and value', () => {
        aogFormComponent.isSafety = true;
        const result = aogFormComponent.safetyEventValidator({value: 'test'} as FormControl);
        expect(result).toBeNull();
    });

    it('Safety event validator: no check and value', () => {
        aogFormComponent.isSafety = false;
        const result = aogFormComponent.safetyEventValidator({value: 'test'} as FormControl);
        expect(result).toBeNull();
    });

    it('Safety event validator: checked and no value', () => {
        aogFormComponent.isSafety = true;
        const result = aogFormComponent.safetyEventValidator({value: ''} as FormControl);
        expect(result).toEqual({ isSafety: true });
    });

    it('Safety event validator: no check and no value', () => {
        aogFormComponent.isSafety = false;
        const result = aogFormComponent.safetyEventValidator({value: ''} as FormControl);
        expect(result).toBeNull();
    });


    // it('Autocomplete tail, fleet and operator', () => {
    //     aogFormComponent.aircraftList = [
    //         new Aircraft('TAIL1', 'FLEET', 'OPERATOR' )
    //     ];
    //     aogFormComponent.onSelectAircraft('TAIL1');
    //     expect(aogFormComponent.aog.tail).toEqual('TAIL1') ;
    //     expect(aogFormComponent.aog.tail).toEqual('TAIL1') ;
    //     expect(aogFormComponent.aog.tail).toEqual('TAIL1') ;
    // });

});
