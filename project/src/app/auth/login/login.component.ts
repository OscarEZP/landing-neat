import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from "@angular/forms";

import {AuthService} from '../_services/auth.service';

@Component({
    selector: 'lsl-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    user: string;
    password: string;
    registerView: boolean;
    routeData: any;

    constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {
        this.authService = authService;
        this.user = "";
        this.password = "";
        this.registerView = false;
    }

    ngOnInit() {
        this.routeData = this.route.data.
        subscribe(v => {
            if(v.logout && this.authService.getIsLoggedIn()){
                this.authService.logOut();
                this.router.navigate([this.authService.getLoginUrl()]);
            }else if(this.authService.getIsLoggedIn()){
                this.router.navigate([ this.authService.getRedirectUrl() ]);
            }
        });
    }

    logIn(form:NgForm){
        // use form for validation
        this.authService.logIn();
        this.router.navigate([this.authService.getRedirectUrl()]);
    }

}
