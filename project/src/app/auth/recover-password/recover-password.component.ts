import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {RecoverPasswordService} from '../_services/recoverPassword.service';

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

    constructor(private recoverPasswordService: RecoverPasswordService, private router: Router, fb: FormBuilder) {
        this.recoverPasswordService = recoverPasswordService;
        this.destination = '';
        this.recoverPasswordForm = fb.group({
            'verificationCodeFormControl': this.verificationCodeFormControl,
            'passwordFormControl': this.passwordFormControl,
            'confirmPasswordFormControl': this.confirmPasswordFormControl
        })


    }

    ngOnInit() {
        this.destination = this.recoverPasswordService.getData().destination;
    }

    changePassword(form: NgForm) {
        if (form.valid) {
            const data: { username: string, password: string, confirmPassword: string, verificationCode: string } = this.recoverPasswordService.getData();
            if (data.password === data.confirmPassword) {
                this.recoverPasswordService.changePassword(data.username, data.password, data.verificationCode).then(value => {
                        this.router.navigate([this.recoverPasswordService.getRedirectUrl()]);
                }).catch(reason => {
                    console.error(reason.toString());
                });
            } else {
                console.error("password not same")
            }
        }
    }

    resend(username: string) {
        this.recoverPasswordService.findAccount(username);
    }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

