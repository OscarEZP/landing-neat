import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ErrorStateMatcher} from '@angular/material/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {RecoverPasswordService} from '../_services/recoverPassword.service';
import {MessageService} from '../../shared/_services/message.service';
import {StorageService} from '../../shared/_services/storage.service';

@Component({
    selector: 'lsl-find-account',
    templateUrl: './find-account.component.html',
    styleUrls: ['./find-account.component.scss']
})
export class FindAccountComponent implements OnInit {

    private _username: string;

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

    usernameFormControl = new FormControl('', [
        Validators.required
    ]);

    matcher = new MyErrorStateMatcher();
    findAccountForm: FormGroup;


    constructor(
        private _messageService: MessageService,
        private _storageService: StorageService,
        private _router: Router,
        private _fb: FormBuilder,
        private _recoverPasswordService: RecoverPasswordService) {
        this.findAccountForm = _fb.group({
            'usernameFormControl': this.usernameFormControl
        });
    }

    ngOnInit() {
        this._recoverPasswordService.reset();
    }

    findAccount(form: FormGroup) {
        if (form.valid) {
            this._recoverPasswordService.findAccount(this.usernameFormControl.value).then(value => {
                this._storageService.addRecoverPassword(this.usernameFormControl.value, value);
                this._router.navigate([this._recoverPasswordService.getRecoverUrl()]);

            }).catch(reason => {
                this._messageService.openSnackBar(reason);
            });

        }
    }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return (control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}
