import {inject, TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {AuthGuardService} from './authGuard.service';
import {StorageService} from '../../shared/_services/storage.service';
import {AuthService} from './auth.service';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, Router} from '@angular/router';
import {DatetimeService} from '../../shared/_services/datetime.service';
import {DataService} from '../../shared/_services/data.service';
import {Observable} from 'rxjs/Observable';

jest.mock('../../shared/_services/storage.service');

let service;
let httpMock;

describe('AuthGuard Service Test', () => {

    const MockStorageService = {
        // getSingle: () => Observable.of(fakeGroupTypeRS)
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ],
            providers: [
                AuthGuardService,
                {provide: StorageService, useValue: MockStorageService},
                AuthService
            ]
        });
    });

    beforeEach(() => {
        inject([
            AuthGuardService,
            HttpTestingController,
            AuthService,
            Router,
            StorageService
        ], (
            _service,
            _httpMock,
            _authService,
            _router,
            _storageService
        ) => {
            service = new AuthGuardService(_authService, _router, _storageService);
            httpMock = _httpMock;
        }));
    });

    it('Test to know if the service is loaded', () => {
        expect(AuthGuardService).toBeTruthy();
    });

    it('Testing Hemicycle user', () => {
        const route = new ActivatedRouteSnapshot();
        const state = new RouterStateSnapshot();
        service.canActivate(route, state);
    });

});

/*
@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {

    constructor(
        private _authService: AuthService,
        private _router: Router,
        private _storageService: StorageService
    ) {

    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!!this._storageService.getCurrentUser().groupList &&
            !!this._storageService.getCurrentUser()
                .groupList
                .find(group => group.name === this._authService.getHemicycleGroupName().toLocaleLowerCase())
        ) {
            this._router.navigate([ this._authService.getHemicycleUrl() ]);
            return false;
        }

        if (this._authService.getIsLoggedIn() && this._authService.getIsAuth(state.url)) {
            return true;
        }

        this._router.navigate([ this._authService.getLoginUrl() ]);
        return false;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // Auth for childs
        return true;
    }

}
*/
