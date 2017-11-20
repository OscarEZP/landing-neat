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
    usernameFormControl = new FormControl('', [
        Validators.required
    ]);

    matcher = new MyErrorStateMatcher();
    findAccountForm: FormGroup;


    constructor(private recoverPasswordService: RecoverPasswordService, private messageService: MessageService, private storageService: StorageService, private router: Router, private fb: FormBuilder) {

    }

    ngOnInit() {
        this.recoverPasswordService.reset();
        this.findAccountForm = this.fb.group({
            'usernameFormControl': this.usernameFormControl
        })
    }

    findAccount(form: NgForm) {
        if (form.valid) {
            this.recoverPasswordService.findAccount(this.usernameFormControl.value).then(value => {
                this.storageService.addRecoverPassword(this.usernameFormControl.value,value);
                this.router.navigate([this.recoverPasswordService.getRecoverUrl()]);

            }).catch(reason => {
                this.messageService.openSnackBar(reason);
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

