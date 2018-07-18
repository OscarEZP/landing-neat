import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {RecoverPasswordService} from '../_services/recoverPassword.service';
import {MessageService} from '../../shared/_services/message.service';
import * as constants from '../../constants';
import {StorageService} from '../../shared/_services/storage.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'lsl-change-password',
    templateUrl: './recover-password.component.html',
    styleUrls: ['./recover-password.component.scss']
})
export class RecoverPasswordComponent implements OnInit {
    verificationCodeFormControl = new FormControl('', [
        Validators.required
    ]);
    passwordFormControl = new FormControl('', [
        Validators.required
    ]);
    confirmPasswordFormControl = new FormControl('', [
        Validators.required
    ]);

    matcher = new MyErrorStateMatcher();
    recoverPasswordForm: FormGroup;
    private _destination: string;
    private _hideCp: boolean;
    private _hidePw: boolean;
    public data = {username: '', password: '', confirmPassword: '', verificationCode: '', destination: '' };

    constructor(
        private messageService: MessageService,
        private router: Router,
        private _fb: FormBuilder,
        private _translate: TranslateService,
        private _storageService: StorageService,
        private _recoverPasswordService: RecoverPasswordService
    ) {
        this._destination = '';
        this._translate.setDefaultLang('en');

        this.recoverPasswordForm = _fb.group({
            'verificationCodeFormControl': this.verificationCodeFormControl,
            'passwordFormControl': this.passwordFormControl,
            'confirmPasswordFormControl': this.confirmPasswordFormControl
        });
    }

    ngOnInit() {
        this.destination = this._storageService.getRecoverDestination();
    }

    changePassword(form: FormGroup) {
        if (form.valid) {
            if (this.data.password === this.data.confirmPassword) {
                this._recoverPasswordService.changePassword(this._storageService
                    .getRecoverAccount(), this.data.password, this.data.verificationCode)
                    .then(() => {
                        this._storageService.removeRecoverPassword();
                        this.router.navigate([this._recoverPasswordService.getRedirectUrl()]);
                }).catch(reason => {
                    this.messageService.openSnackBar(reason);
                });
            } else {
                this.messageService.openSnackBar(constants.ERROR_PASSWORD_NOT_SAME);

            }
        }
    }

    resend(username: string) {
        this._recoverPasswordService.findAccount(username).catch(reason => {
            this.messageService.openSnackBar(reason);
        });
    }

    cancel() {
        this._storageService.removeRecoverPassword();
        this.router.navigate([this._recoverPasswordService.getRedirectUrl()]);
    }


    get hideCp(): boolean {
        return this._hideCp;
    }

    set hideCp(value: boolean) {
        this._hideCp = value;
    }

    get hidePw(): boolean {
        return this._hidePw;
    }

    set hidePw(value: boolean) {
        this._hidePw = value;
    }

    get storageService(): StorageService {
        return this._storageService;
    }

    set storageService(value: StorageService) {
        this._storageService = value;
    }

    get destination(): string {
        return this._destination;
    }

    set destination(value: string) {
        this._destination = value;
    }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return (control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

