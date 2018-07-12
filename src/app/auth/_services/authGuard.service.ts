import {Injectable} from '@angular/core';
import {
    ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, Router
} from '@angular/router';
import {AuthService} from './auth.service';
import {StorageService} from '../../shared/_services/storage.service';

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
