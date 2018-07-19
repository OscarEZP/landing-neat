import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {TranslationService} from './translation.service';
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from './message.service';

let service;
describe('Translation Service Test', () => {

    const MockTranslateService = {
        setDefaultLang: () => true
    };

    const MockMessageService = {
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers: [
                TranslationService,
                { provide: TranslateService, useValue: MockTranslateService },
                { provide: MessageService, useValue: MockMessageService }
            ]
        });
    });

    beforeEach(() => service = new TranslationService(MockTranslateService as TranslateService, MockMessageService as MessageService));

    it('Service should be loaded', () => expect(TranslationService).toBeTruthy());

});
