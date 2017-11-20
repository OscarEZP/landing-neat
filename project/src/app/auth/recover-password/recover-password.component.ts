import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {RecoverPasswordService} from '../_services/recoverPassword.service';
import {MessageService} from '../../shared/_services/message.service';
import * as constants from '../../constants';
import {StorageService} from '../../shared/_services/storage.service';

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

    constructor(private recoverPasswordService: RecoverPasswordService, private storageService: StorageService, private messageService: MessageService, private router: Router, private fb: FormBuilder) {
        this.destination = '';
    }

    ngOnInit() {
        this.destination = this.storageService.getRecoverDestination();
        this.recoverPasswordForm = this.fb.group({
            'verificationCodeFormControl': this.verificationCodeFormControl,
            'passwordFormControl': this.passwordFormControl,
            'confirmPasswordFormControl': this.confirmPasswordFormControl
        })
    }

    changePassword(form: NgForm) {
        if (form.valid) {
            const data: { password: string, confirmPassword: string, verificationCode: string } = this.recoverPasswordService.getData();
            if (data.password === data.confirmPassword) {
                this.recoverPasswordService.changePassword(this.storageService.getRecoverAccount(), data.password, data.verificationCode).then(value => {

                    this.storageService.removeRecoverPassword();
                    this.router.navigate([this.recoverPasswordService.getRedirectUrl()]);
                }).catch(reason => {
                    this.messageService.openSnackBar(reason);
                });
            } else {
                this.messageService.openSnackBar(constants.ERROR_PASSWORD_NOT_SAME);

            }
        }
    }

    resend(username: string) {
        this.recoverPasswordService.findAccount(username).catch(reason => {
            this.messageService.openSnackBar(reason);
        });
    }

    cancel() {
        this.storageService.removeRecoverPassword();
        this.router.navigate([this.recoverPasswordService.getRedirectUrl()]);
    }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}
