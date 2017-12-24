import {TestBed, inject} from '@angular/core/testing';

import {DatetimeService} from './datetime.service';
import {HttpModule} from "@angular/http";

describe('DatetimeService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule
            ],
            providers: [DatetimeService]
        });
    });

    it('should be created', inject([DatetimeService], (service: DatetimeService) => {
        expect(service).toBeTruthy();
    }));
});
