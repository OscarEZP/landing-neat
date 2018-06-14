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
    destination: string;
    private _hideCp: boolean;
    private _hidePw: boolean;
    private _recoverPasswordService: RecoverPasswordService;
    private _storageService: StorageService;

    constructor(
        private messageService: MessageService,
        private router: Router,
        private fb: FormBuilder,
        private _translate: TranslateService
    ) {
        this.destination = '';
        this._translate.setDefaultLang('en');
    }

    ngOnInit() {
        this.destination = this._storageService.getRecoverDestination();
        this.recoverPasswordForm = this.fb.group({
            'verificationCodeFormControl': this.verificationCodeFormControl,
            'passwordFormControl': this.passwordFormControl,
            'confirmPasswordFormControl': this.confirmPasswordFormControl
        });
    }

    changePassword(form: FormGroup) {
        if (form.valid) {
            const data: { password: string, confirmPassword: string, verificationCode: string } = this._recoverPasswordService.getData();
            if (data.password === data.confirmPassword) {
                this._recoverPasswordService.changePassword(this._storageService
                    .getRecoverAccount(), data.password, data.verificationCode)
                    .then(value => {
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

    get recoverPasswordService(): RecoverPasswordService {
        return this._recoverPasswordService;
    }

    set recoverPasswordService(value: RecoverPasswordService) {
        this._recoverPasswordService = value;
    }

    get storageService(): StorageService {
        return this._storageService;
    }

    set storageService(value: StorageService) {
        this._storageService = value;
    }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return (control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

