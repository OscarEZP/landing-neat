import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, Router} from '@angular/router';

import {AuthService} from './auth.service';
import {RoutingService} from '../../shared/_services/routing.service';

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {
    constructor(private authService: AuthService, private router: Router, private routingService: RoutingService) {

    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const url: string = state.url;
        console.log('Url:' + url);

        this.routingService.setActiveModule(url);

        if (this.authService.getIsLoggedIn()) {
            return true;
        }

        this.router.navigate([ this.authService.getLoginUrl() ]);
        return false;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // Auth for childs
        return true;
    }

}
