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

    public static ACCEPT = 'accept';
    public static CANCEL = 'cancel';

    private _response: string;

    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
                private _messageService: MessageService,
                private _dialogService: DialogService,
                private _translate: TranslateService) {
        this._translate.setDefaultLang('en');
        this.response = null;
    }

    ngOnInit() {
    }

    closeCancelDialog() {
        this._messageService.dismissSnackBar();
        this.response = this.response === null ? CancelComponent.CANCEL : this.response;
    }

    closeContingencyForm() {
        this.response = CancelComponent.ACCEPT;
        this._dialogService.closeAllDialogs();
        this.closeCancelDialog();
    }

    get response(): string {
        return this._response;
    }

    set response(value: string) {
        this._response = value;
    }
}
