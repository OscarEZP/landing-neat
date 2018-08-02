import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../shared/_services/message.service';
import { StorageService } from '../../shared/_services/storage.service';
import {AuthDataInterface, AuthService} from '../_services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import {Routing, RoutingService} from '../../shared/_services/routing.service';
import {ManagementUser} from '../../shared/_models/management/managementUser';
import { Access } from '../../shared/_models/management/access';
import {Subscription} from 'rxjs/Subscription';


@Component({
    selector: 'lsl-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    private static ADMIN_MODE = 'admin';
    private static USER_MODE = 'user';
    private static GENERAL_CODE = 'SYC';

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

    private _routing: Routing;
    private _routingSubs: Subscription;

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
        this._routingSubs = this.getRoutingSubs();

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

    private getRoutingSubs(): Subscription {
        return this._routingService.routing$
            .subscribe(v => this.routing = v);
    }

    /**
     * Method for get an access token, if success, the user will be redirected to any section enabled
     * @param {NgForm} form
     */
    logIn(form: FormGroup) {
        this.activateLoadingBar(true);
        if (form.valid && !this.disableButton) {
            this.disableButton = true;
            const data = this.data;
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
        this._authService.getAccess(username).then(
        res => {
            const role = this.routing.arrMenu.find(menu => {
                const moduleConfig = this._authService.modulesConfig.filter(
                    mod => this.authModule(res).find(mu => mu.module === mod.code)
                );
                return !!moduleConfig.find(config => config.module === menu.slug ||
                    !!menu.submenu.find(sub => sub.slug === config.module));
            });
            if (role) {
                this._authService.setRedirectUrl(role.link);
                this.router.navigate([this._authService.getRedirectUrl()]);
            }
        }).catch(error => this._messageService.openSnackBar(error)).then(value2 => {
            this._authService.getUserAtecFilter(this._authService.getTechnicalAnalysisSearchSignature());
        });
    }

    /**
     * Check if a module has admin or user permission
     * @param {ManagementUser} managementUser
     * @returns {Module[]}
     */
    private authModule(managementUser: ManagementUser): Access[] {
        return managementUser.access
            .filter(m => (m.role === LoginComponent.ADMIN_MODE ||
                (m.role === LoginComponent.USER_MODE && m.module !== LoginComponent.GENERAL_CODE)));
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

    get data(): AuthDataInterface {
        return this._authService.data;
    }

    set data(value: AuthDataInterface) {
        this._authService.data = value;
    }

    get routing(): Routing {
        return this._routing;
    }

    set routing(value: Routing) {
        this._routing = value;
    }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return (control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}
