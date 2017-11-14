import {Component, OnInit} from '@angular/core';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';

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

    constructor() {
    }

    ngOnInit() {
    }

    findAccount(form: NgForm) {
        // use form for validation
    }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

