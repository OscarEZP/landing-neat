import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {RecoverPasswordService} from "../_services/recoverPassword.service";

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


    constructor(private recoverPasswordService: RecoverPasswordService, private router: Router, fb: FormBuilder) {
        this.recoverPasswordService = recoverPasswordService;
        this.findAccountForm = fb.group({
            'usernameFormControl': this.usernameFormControl
        })
    }

    ngOnInit() {
        this.recoverPasswordService.reset();
    }

    findAccount(form: NgForm) {
        if (form.valid) {
            this.recoverPasswordService.findAccount(this.usernameFormControl.value).then(value => {
                this.router.navigate([this.recoverPasswordService.getRecoverUrl()]);

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

