import {Injectable} from '@angular/core';
import {
    ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, Router
} from '@angular/router';
import {AuthService} from './auth.service';
import {StorageService} from '../../shared/_services/storage.service';
import {Group} from '../../shared/_models/user/group';

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(
        private _authService: AuthService,
        private _router: Router,
        private _storageService: StorageService
    ) {

    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!!this.groupList &&
            !!this.groupList.find(group => group.name === this._authService.getHemicycleGroupName().toLocaleLowerCase())
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

    get groupList(): Group[] {
        return this._storageService.getCurrentUser().groupList;
    }

}
