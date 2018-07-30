import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AuthService} from './auth.service';
import {RouterTestingModule} from '@angular/router/testing';
import {StorageService} from '../../shared/_services/storage.service';
import {Observable} from 'rxjs/Observable';
import {ApiRestService} from '../../shared/_services/apiRest.service';

let service;



describe('Auth Service Test', () => {

    const MockStorageService = {
        getCurrentUser: () => ({ groupList: [] }),
        removeCurrentUser: () => true,
        removeUserManagement: () => true,
        removeUserAtecFilter: () => true,
    };

    const MockApiRestService = {
        getAll: () => new Observable(s => {s.next([]); return s.complete();}),
        search: () => new Observable(s => {s.next([]); return s.complete();}),
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ],
            providers: [
                AuthService,
                {provide: StorageService, useValue: MockStorageService},
                {provide: ApiRestService, useValue: MockApiRestService}
            ]
        });

        service = new AuthService(MockStorageService as StorageService, MockApiRestService as ApiRestService);
    });

    it('Auth Service should be load', () => {
        expect(AuthService).toBeTruthy();
    });

    it('Modules configuration should be set', () => {
        expect(!!service.modulesConfig.find(m => m.code === 'OP')).toBeTruthy();
        expect(!!service.modulesConfig.find(m => m.code === 'FH')).toBeTruthy();
        expect(!!service.modulesConfig.find(m => m.code === 'SYC')).toBeTruthy();
    });

    it('Login resolves', () => {
        expect.assertions(1);
        service.logIn('user', 'password').then(x => expect(x).toEqual([]));
    });

    it('Logout successful', () => {
        const fn1 = jest.spyOn(service._storageService, 'removeCurrentUser');
        const fn2 = jest.spyOn(service._storageService, 'removeUserManagement');
        const fn3 = jest.spyOn(service._storageService, 'removeUserAtecFilter');
        service.logOut();
        expect(fn1).toHaveBeenCalled();
        expect(fn2).toHaveBeenCalled();
        expect(fn3).toHaveBeenCalled();
    });



});


