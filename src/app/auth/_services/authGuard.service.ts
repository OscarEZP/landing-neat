import {Injectable} from '@angular/core';
import {
    ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, Router
} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {

    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (
            this.authService.getIsLoggedIn()
            && this.authService.getIsAuth(state.url)
        ) {
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
