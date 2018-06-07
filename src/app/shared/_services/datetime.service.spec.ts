import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {inject, TestBed} from '@angular/core/testing';
import {DatetimeService} from './datetime.service';
import {ApiRestService} from './apiRest.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

let service;
let httpMock;
const http = {
    get: jest.fn()
};

describe('DateTime Service Test', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers: [
                DatetimeService,
                ApiRestService
            ]
        });
    });

    beforeEach(
        inject([DatetimeService, HttpTestingController], (_service, _httpMock) => {
            service = new DatetimeService(http as any);
            httpMock = _httpMock;
        }));

    it('Test to know if the module exist', () => {
        expect(DatetimeService).toBeTruthy();
    });


    it('getTime$: should return actual time from API Service', () => {
        const mockDateTimeResponse = {
            'currentTime' : '2018-06-06T18:46:22.908Z',
            'currentTimeLong' : 1528310782908
        };

        http.get.mockImplementationOnce(() => Observable.of(mockDateTimeResponse));

        service.getTime().subscribe(currentTime => {
            expect(http.get).toBeCalledWith('https://staging.mcp.maintenix.ifs.cloud/api/security/currentdatetime');
            expect(currentTime._currentTime).toBe('2018-06-06T18:46:22.908Z');
            expect(currentTime._currentTimeLong).toBe(1528310782908);
        });
    });
});
