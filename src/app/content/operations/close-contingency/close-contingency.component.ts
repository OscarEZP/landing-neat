import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from '../../_services/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { StorageService } from '../../../shared/_services/storage.service';
import { ContingencyService } from '../_services/contingency.service';
import { MessageService } from '../../../shared/_services/message.service';
import { DataService } from '../../../shared/_services/data.service';


@Component({
    selector: 'lsl-close-contingency',
    templateUrl: './close-contingency.component.html',
    styleUrls: ['./close-contingency.component.scss']
})
export class CloseContingencyComponent implements OnInit {

    public closeForm: FormGroup;
    public closeSignature;
    public snackBarMessage;

    constructor(private dialogService: DialogService,
                private translate: TranslateService,
                private storageService: StorageService,
                private contingencyService: ContingencyService,
                private messageService: MessageService,
                private dataService: DataService,
                private fb: FormBuilder,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.translate.setDefaultLang('en');

        this.closeForm = fb.group({
            'status': ['aog'],
            'observation': [null, Validators.required]
        });

        this.closeSignature = {};
        this.snackBarMessage = '';
    }

    ngOnInit() {
    }

    translateString(toTranslate: string): void {
        this.translate.get(toTranslate).subscribe((res: string) => {
            this.snackBarMessage = res;
        });
    }

    submitForm(value: any) {
        const user = this.storageService.getCurrentUser();
        this.closeSignature.id = this.data.id;
        this.closeSignature.username = user.userId;
        this.closeSignature.observation = value.observation;
        this.contingencyService.closeContingency(this.closeSignature).subscribe(
            res => {
                this.translateString('OPERATIONS.CLOSE_COMPONENT.CLOSE_SUCCESS');
                this.messageService.openSnackBar(this.snackBarMessage);
                this.dismissCloseContigency();
                this.dataService.stringMessage('reload');
            }, err => {
                this.messageService.openSnackBar(err);
            }
        );
    }

    dismissCloseContigency(): void {
        this.dialogService.closeAllDialogs();
    }

}
