import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AuthService} from '../_services/auth.service';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';

@Component({
    selector: 'lsl-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    usernameFormControl = new FormControl('', [
        Validators.required
    ]);
    passwordFormControl = new FormControl('', [
        Validators.required
    ]);

    matcher = new MyErrorStateMatcher();

    user: string;
    password: string;
    registerView: boolean;
    routeData: any;

    loginForm: FormGroup;

    constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute, fb: FormBuilder) {
        this.authService = authService;
        this.user = '';
        this.password = '';
        this.registerView = false;
        this.loginForm = fb.group({
            'usernameFormControl': this.usernameFormControl,
            'passwordFormControl': this.passwordFormControl
        })
    }

    ngOnInit() {
        this.routeData = this.route.data.subscribe((data: {logout: string}) => {
            if (data.logout && this.authService.getIsLoggedIn()) {
                this.authService.logOut();
                this.router.navigate([this.authService.getLoginUrl()]);
            } else if (this.authService.getIsLoggedIn()) {
                this.router.navigate([this.authService.getRedirectUrl()]);
            }
        });
    }

    logIn(form: NgForm) {
        if(form.valid) {
            this.authService.logIn();
            this.router.navigate([this.authService.getRedirectUrl()]);
        }
    }

}


export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}
