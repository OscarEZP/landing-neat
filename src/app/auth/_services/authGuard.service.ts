import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, Router} from '@angular/router';

import {AuthService} from './auth.service';
import {RoutingService} from '../../shared/_services/routing.service';
import {DataService} from '../../shared/_services/data.service';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {
    constructor(
        private authService: AuthService,
        private router: Router,
        private routingService: RoutingService,
        private _dataService: DataService
    ) {

    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const url: string = state.url;

        this.routingService.setActiveModule(url);

        if (this.authService.getIsLoggedIn()) {
            return true;
        }

        this.router.navigate([ this.authService.getLoginUrl() ]);
        console.log('Trigger error');
        this._dataService.triggerError(new HttpErrorResponse({status: 401, error: true}));
        return false;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // Auth for childs
        return true;
    }

}
