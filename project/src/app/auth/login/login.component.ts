import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../_services/auth.service';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {MessageService} from "../../shared/_services/message.service";


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

    registerView: boolean;
    routeData: any;

    loginForm: FormGroup;
    formBuilder: FormBuilder;

    constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder, private  messageService: MessageService) {
        this.authService = authService;
        this.messageService = this.messageService;
        this.registerView = false;
        this.formBuilder = fb;

    }

    ngOnInit() {
        this.authService.reset();
        this.loginForm = this.formBuilder.group({
            'usernameFormControl': this.usernameFormControl,
            'passwordFormControl': this.passwordFormControl
        })
        this.routeData = this.route.data.subscribe((data: { logout: string }) => {

            if (data.logout && this.authService.getIsLoggedIn()) {
                this.authService.logOut();
                this.router.navigate([this.authService.getLoginUrl()]);
            } else if (this.authService.getIsLoggedIn()) {
                this.router.navigate([this.authService.getRedirectUrl()]);
            }
        });
    }

    logIn(form: NgForm) {
        if (form.valid) {
            const data = this.authService.getData();
            this.authService.logIn(data.username, data.password).then(value => {
                localStorage.setItem('currentUser', value.userName);
                this.router.navigate([this.authService.getRedirectUrl()]);
            }).catch(reason => {
                this.messageService.openSnackBar(reason);
            });

        }
    }


}


export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}
