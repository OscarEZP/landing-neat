import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../shared/_services/message.service';
import { StorageService } from '../../shared/_services/storage.service';
import { AuthService } from '../_services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import {RoutingService} from '../../shared/_services/routing.service';
import {ManagementUser} from '../../shared/_models/management/managementUser';
import {Module} from '../../shared/_models/management/module';


@Component({
    selector: 'lsl-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    private static ADMIN_MODE = 'admin';
    private static USER_MODE = 'user';
    private static GENERAL_CODE = 'GE';

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
                const moduleConfig = this._authService.modulesConfig.filter(
                    mod => this.authModule(res).find(mu => mu.code === mod.code)
                );
                return !!moduleConfig.find(config => config.module === menu.slug ||
                    !!menu.submenu.find(sub => sub.slug === config.module));
            });
            if (role) {
                this._authService.setRedirectUrl(role.link);
                this.router.navigate([this._authService.getRedirectUrl()]);
            }
        }).catch(error => this._messageService.openSnackBar(error));
    }

    /**
     * Check if a module has admin or user permission
     * @param {ManagementUser} managementUser
     * @returns {Module[]}
     */
    private authModule(managementUser: ManagementUser): Module[] {
        return managementUser.modules
            .filter(m => !!m.roles.find(
                r => r === LoginComponent.ADMIN_MODE ||
                    (r === LoginComponent.USER_MODE && m.code !== LoginComponent.GENERAL_CODE)
            ));
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
        this._authService.data = value;
    }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}
