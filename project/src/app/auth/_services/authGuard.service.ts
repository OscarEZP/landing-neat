import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, Router} from "@angular/router";

import {AuthService} from "./auth.service";

@Injectable()
export class AuthGuardService implements CanActivate, CanActivateChild {
    constructor(private authService:AuthService, private router:Router){
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;
        console.log('Url:'+ url);
        if (this.authService.getIsLoggedIn()) {
            return true;
        }
        // this.authService.setRedirectUrl(url);
        this.router.navigate([ this.authService.getLoginUrl() ]);
        return false;
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;
        console.log('Url2:'+ url);
        if (this.authService.getIsLoggedIn()) {
            return true;
        }
        // this.authService.setRedirectUrl(url);
        this.router.navigate([ this.authService.getLoginUrl() ]);
        return false;
    }

} 