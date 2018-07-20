import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogService } from '../../_services/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { StorageService } from '../../../shared/_services/storage.service';
import { ContingencyService } from '../../_services/contingency.service';
import { MessageService } from '../../../shared/_services/message.service';
import { DataService } from '../../../shared/_services/data.service';
import { CancelComponent } from '../cancel/cancel.component';
import { ApiRestService } from '../../../shared/_services/apiRest.service';

@Component({
    selector: 'lsl-close-contingency',
    templateUrl: './close-contingency.component.html',
    styleUrls: ['./close-contingency.component.scss']
})
export class CloseContingencyComponent implements OnInit {

    public closeForm: FormGroup;
    public closeSignature;
    public snackBarMessage;
    public typeCloseList;

    constructor(private dialogService: DialogService,
                private translate: TranslateService,
                private storageService: StorageService,
                private contingencyService: ContingencyService,
                private messageService: MessageService,
                private dataService: DataService,
                private apiRestService: ApiRestService,
                private fb: FormBuilder,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.translate.setDefaultLang('en');

        this.closeForm = fb.group({
            'type': [null, Validators.required],
            'observation': [null, Validators.required]
        });

        this.closeSignature = {};
        this.snackBarMessage = '';
        this.typeCloseList = [];
    }

    ngOnInit() {
        this.getConfigurationClose();
    }

    private getConfigurationClose(): void {
        this.apiRestService.getSingle('configTypes', 'CLOSE_TYPE').subscribe(rs => {
            this.typeCloseList = rs;
        });
    }

    translateString(toTranslate: string): void {
        this.translate.get(toTranslate).subscribe((res: string) => {
            this.snackBarMessage = res;
        });
    }

    submitForm(value: any) {
        if (this.closeForm.valid) {
            const user = this.storageService.getCurrentUser();
            this.closeSignature.id = this.data.id;
            this.closeSignature.username = user.userId;
            this.closeSignature.type = value.type;
            this.closeSignature.observation = value.observation;
            this.contingencyService.closeContingency(this.closeSignature).subscribe(
                res => {
                    this.translateString('OPERATIONS.CLOSE_COMPONENT.CLOSE_SUCCESS');
                    this.messageService.openSnackBar(this.snackBarMessage);
                    this.dismissCloseContigency();
                    this.dataService.stringMessage('reload');
                }, err => {
                }
            );
        } else {
            this.translateString('OPERATIONS.VALIDATION_ERROR_MESSAGE');
            this.messageService.openSnackBar(this.snackBarMessage);
        }
    }

    openCancelDialog() {
        if (this.validateFilledItems()) {
            this.translateString('OPERATIONS.CANCEL_COMPONENT.MESSAGE');
            this.messageService.openFromComponent(CancelComponent, {
                data: {message: this.snackBarMessage},
                horizontalPosition: 'center',
                verticalPosition: 'top'
            });
        } else {
            this.dismissCloseContigency();
        }
    }

    private validateFilledItems(): boolean {
        let counterFilled = 0;
        const defaultValid = 0;
        Object.keys(this.closeForm.controls).forEach(elem => {
            if (this.closeForm.controls[elem].valid) {
                counterFilled = counterFilled + 1;
            }
        });
        return counterFilled > defaultValid;
    }

    dismissCloseContigency(): void {
        this.dialogService.closeAllDialogs();
    }

}
