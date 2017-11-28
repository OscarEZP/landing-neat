import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../_services/auth.service';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {MessageService} from '../../shared/_services/message.service';
import {StorageService} from '../../shared/_services/storage.service';
import {Subscription} from 'rxjs/Subscription';
import {DataService} from '../../shared/_services/data.service';


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

    private _messageDataSubscription: Subscription;

    public loading: boolean;
    public mode: string;
    public value: number;
    public disableButton: boolean;

    loginForm: FormGroup;

    constructor(
        private authService: AuthService,
        private storageService: StorageService,
        private router: Router,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private  messageService: MessageService,
        private messageData: DataService) {
        this.registerView = false;
        this.loading = true;
        this.disableButton = false;
        this.mode = 'determinate';
        this.value = 100;
    }

    ngOnInit() {
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

        this._messageDataSubscription = this.messageData.currentStringMessage.subscribe(message => this.activateLoadingBar(message));
    }

    logIn(form: NgForm) {
        this.messageData.activateLoadingBar('open');

        if (form.valid && !this.disableButton) {
            this.disableButton = true;
            const data = this.authService.getData();
            this.authService.logIn(data.username, data.password).then(value => {
                this.storageService.addCurrentUser(value);
                this.router.navigate([this.authService.getRedirectUrl()]);
                this.messageData.activateLoadingBar('close');
                this.disableButton = false;
            }).catch(reason => {
                this.messageService.openSnackBar(reason);
                this.messageData.activateLoadingBar('close');
                this.disableButton = false;
            });

        }
    }
    activateLoadingBar(message: string) {
        if (message === 'open') {
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
