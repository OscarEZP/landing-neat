import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AuthGuardService} from './authGuard.service';
import {StorageService} from '../../shared/_services/storage.service';
import {AuthService} from './auth.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';

let service;
let routeSnapshot;
let stateSnapshot;

jest.mock('../../shared/_services/storage.service');
jest.mock('./auth.service');

describe('AuthGuard Service Test', () => {

    const MockStorageService = {
        getCurrentUser: () => ({ groupList: [] })
    };

    const MockAuthService = {
        getHemicycleGroupName: () => AuthService.HEMICYCLE_GROUP_NAME,
        getHemicycleUrl: () => AuthService.HEMICYCLE_URL,
        getIsAuth: () => true,
        getIsLoggedIn: () => true
    };

    const MockRouter = {
        navigate: () => {}
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule
            ],
            providers: [
                AuthGuardService,
                {provide: StorageService, useValue: MockStorageService},
                {provide: AuthService, useValue: MockAuthService},
            ]
        });

        routeSnapshot = new ActivatedRouteSnapshot();
        stateSnapshot = {url: ''};

        service = new AuthGuardService(MockAuthService as AuthService, MockRouter as Router, MockStorageService as StorageService);
    });

    it('Test to know if the service is loaded', () => {
        expect(AuthGuardService).toBeTruthy();
    });

    it('Testing Hemicycle user redirection', () => {
        const HemicycleMocStorageService = { getCurrentUser: () => ({ groupList: [{name: AuthService.HEMICYCLE_GROUP_NAME}] }) };
        const HemicycleService = new AuthGuardService(MockAuthService as AuthService, MockRouter as Router, HemicycleMocStorageService as StorageService);
        expect(HemicycleService.canActivate(routeSnapshot, stateSnapshot as RouterStateSnapshot)).toBeFalsy();
    });

    it('Logged user and enabled URL', () => {
        expect(service.canActivate(routeSnapshot, stateSnapshot)).toBeTruthy();
    });

    it('Logged user and disabled URL', () => {
        const DisabledMocAuthService = { getIsLoggedIn: () => true, getIsAuth: () => false, getLoginUrl: () => '' };
        const DisabledUrlService = new AuthGuardService(DisabledMocAuthService as AuthService, MockRouter as Router, MockStorageService as StorageService);
        expect(DisabledUrlService.canActivate(routeSnapshot, stateSnapshot)).toBeFalsy();
    });

});


