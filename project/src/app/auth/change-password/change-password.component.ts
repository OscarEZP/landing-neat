import {Component, OnInit} from '@angular/core';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {AuthService} from '../_services/auth.service';

@Component({
    selector: 'lsl-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
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
    changePasswordForm: FormGroup;

    username: string;
    password: string;
    confirmPassword: string;
    verificationCode: string;

    constructor(private authService: AuthService, fb: FormBuilder) {
        this.authService = authService;
        this.username = 'millanes1@gmail.com';
        this.password = '';
        this.verificationCode = '';
        this.changePasswordForm = fb.group({
            'verificationCodeFormControl': this.verificationCodeFormControl,
            'passwordFormControl': this.passwordFormControl,
            'confirmPasswordFormControl': this.confirmPasswordFormControl
        })
    }

    ngOnInit() {
    }

    changePassword(form: NgForm) {
        if (form.valid) {

            this.authService.changePassword(this.username, this.password, this.verificationCode);
        }
    }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

