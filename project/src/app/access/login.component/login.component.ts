import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
    selector: 'lsl-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    user: string;
    password: string;
    registerView: boolean;

    constructor(private authService: AuthService, private router: Router) {
        this.authService = authService;
        this.user = ""
        this.password = ""
        this.registerView = false
    }

    ngOnInit() {

    }

    logIn() {
        this.authService.logIn();
        this.router.navigate(['/usuario/dashboard/']);
    }

}


