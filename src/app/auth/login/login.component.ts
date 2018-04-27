import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../shared/_services/message.service';
import { StorageService } from '../../shared/_services/storage.service';
import { AuthService } from '../_services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import {RoutingService} from '../../shared/_services/routing.service';


@Component({
    selector: 'lsl-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    private static ADMIN_MODE = 'admin';
    private static USER_MODE = 'user';

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
        protected _authService: AuthService,
        private _storageService: StorageService,
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private  _messageService: MessageService,
        private _translate: TranslateService,
        private _routingService: RoutingService
    ) {
        this._translate.setDefaultLang('en');
    }

    ngOnInit() {
        this.registerView = false;
        this.disableButton = false;
        this.activateLoadingBar(false);

        this._authService.reset();
        this.loginForm = this.fb.group({
            'usernameFormControl': this.usernameFormControl,
            'passwordFormControl': this.passwordFormControl
        });
        this.routeData = this.route.data.subscribe((data: { logout: string }) => {
            if (data.logout && this._authService.getIsLoggedIn()) {
                this._authService.logOut();
                this.router.navigate([this._authService.getLoginUrl()]);
            } else if (this._authService.getIsLoggedIn()) {
                this.router.navigate([this._authService.getRedirectUrl()]);
            }
        });
    }

    /**
     * Method for get an access token, if success, the user will be redirected to any section enabled
     * @param {NgForm} form
     */
    logIn(form: NgForm) {
        this.activateLoadingBar(true);
        if (form.valid && !this.disableButton) {
            this.disableButton = true;
            const data = this._authService.getData();
            this._authService.logIn(data.username, data.password).then(value => {
                this._storageService.addCurrentUser(value);
                this.redirect(data.username);
                this.activateLoadingBar(false);
                this.disableButton = false;
            }).catch(reason => {
                this._messageService.openSnackBar(reason);
                this.activateLoadingBar(false);
                this.disableButton = false;
            });

        }
    }

    /**
     * Redirect to a enabled section if the user role is 'admin' or 'user'
     * @param {string} username
     */
    private redirect(username: string) {
        this._authService.getRoles(username).then(
        res => {
            const role = this._routingService.arrMenu.find(menu => {
                const moduleConfig = this._authService.modulesConfig.find(
                    mod => {
                        const modUser = res.modules
                            .find(m => !!m.roles.find(r => r === LoginComponent.ADMIN_MODE || r === LoginComponent.USER_MODE));
                        return modUser ? modUser.code === mod.code : false;
                    }
                );
                return moduleConfig ?
                    moduleConfig.module === menu.slug || !!menu.submenu.find(sub => sub.slug === moduleConfig.module) :
                    false;
            });
            if (role) {
                this._authService.setRedirectUrl(role.link);
                this.router.navigate([this._authService.getRedirectUrl()]);
            }
        }).catch(error => this._messageService.openSnackBar(error));
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

    get data(): { username: string, password: string } {
        return this._authService.data;
    }

    set data(value: { username: string, password: string }){
        return this._authService.data = value;
    }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}
