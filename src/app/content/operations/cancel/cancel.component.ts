import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';
import { MessageService } from '../../../shared/_services/message.service';
import { DialogService } from '../../_services/dialog.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'lsl-cancel',
    templateUrl: './cancel.component.html',
    styleUrls: ['./cancel.component.css']
})
export class CancelComponent implements OnInit {

    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
                private messageService: MessageService,
                private dialogService: DialogService,
                public translate: TranslateService) {
        this.translate.setDefaultLang('en');
    }

    ngOnInit() {
    }

    closeCancelDialog() {
        this.messageService.dismissSnackBar();
    }

    closeContingencyForm() {
        this.dialogService.closeAllDialogs();
        this.closeCancelDialog();
    }
}
