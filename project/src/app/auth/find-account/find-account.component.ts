import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {AuthService} from '../_services/auth.service';

@Component({
    selector: 'lsl-find-account',
    templateUrl: './find-account.component.html',
    styleUrls: ['./find-account.component.scss']
})
export class FindAccountComponent implements OnInit {
    usernameFormControl = new FormControl('', [
        Validators.required
    ]);

    matcher = new MyErrorStateMatcher();
    findAccountForm: FormGroup;

    username: string;

    constructor(private authService: AuthService, private router: Router, fb: FormBuilder) {
        this.authService = authService;
        this.findAccountForm = fb.group({
            'usernameFormControl': this.usernameFormControl
        })
    }

    ngOnInit() {
    }

    findAccount(form: NgForm) {
        if (form.valid) {
            this.authService.findAccount(this.username).then(value => {
                console.info(value);
                this.router.navigate([this.authService.getRedirectUrlChangePassword()]);
            }).catch(reason => {
                console.error(reason.toString());
            });

        }
    }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

