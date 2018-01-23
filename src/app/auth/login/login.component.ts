import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../shared/_services/message.service';
import { StorageService } from '../../shared/_services/storage.service';
import { AuthService } from '../_services/auth.service';
import { TranslateService } from '@ngx-translate/core';


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

    public loading: boolean;
    public mode: string;
    public value: number;
    public disableButton: boolean;
    public hide: boolean;

    loginForm: FormGroup;

    constructor(
        protected authService: AuthService,
        private storageService: StorageService,
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private  _messageService: MessageService,
        private _translate: TranslateService
    ) {
        this._translate.setDefaultLang('en');
    }

    ngOnInit() {
        this.registerView = false;
        this.disableButton = false;
        this.activateLoadingBar(false);

        this.authService.reset();
        this.loginForm = this.fb.group({
            'usernameFormControl': this.usernameFormControl,
            'passwordFormControl': this.passwordFormControl
        });
        this.routeData = this.route.data.subscribe((data: { logout: string }) => {
            if (data.logout && this.authService.getIsLoggedIn()) {
                this.authService.logOut();
                this.router.navigate([this.authService.getLoginUrl()]);
            } else if (this.authService.getIsLoggedIn()) {
                this.router.navigate([this.authService.getRedirectUrl()]);
            }
        });
        if (this.authService.expired) {
            this._translate.get('ERROR.SESSION').subscribe((res: string) => {
                this._messageService.openSnackBar(res);
            });
        }
    }

    logIn(form: NgForm) {
        this.activateLoadingBar(true);

        if (form.valid && !this.disableButton) {
            this.disableButton = true;
            const data = this.authService.getData();
            this.authService.logIn(data.username, data.password).then(value => {
                this.storageService.addCurrentUser(value);
                this.router.navigate([this.authService.getRedirectUrl()]);
                this.activateLoadingBar(false);
                this.disableButton = false;
            }).catch(reason => {
                this._messageService.openSnackBar(reason);
                this.activateLoadingBar(false);
                this.disableButton = false;
            });

        }
    }
    activateLoadingBar(show: boolean) {
        if (show) {
            this.loading = true;
            this.mode = 'indeterminate';
            this.value = 20;
        } else {
            this.loading = false;
            this.mode = 'determinate';
            this.value = 100;
        }
    }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}
