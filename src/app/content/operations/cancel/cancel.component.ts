import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material';
import { MessageService } from '../../../shared/_services/message.service';
import { DialogService } from '../../_services/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import {isUndefined} from 'util';

@Component({
    selector: 'lsl-cancel',
    templateUrl: './cancel.component.html',
    styleUrls: ['./cancel.component.css']
})
export class CancelComponent implements OnInit {

    public static ACCEPT = 'accept';
    public static CANCEL = 'cancel';

    private _response: string;
    private _closeAll: boolean;

    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
                private _messageService: MessageService,
                private _dialogService: DialogService,
                private _translate: TranslateService) {
        this._translate.setDefaultLang('en');
        this._response = null;
        this._closeAll = !isUndefined(data.closeAll) ? data.closeAll : true;
    }

    ngOnInit() {
    }

    cancel() {
        this._messageService.dismissSnackBar();
        this.response = CancelComponent.CANCEL;
    }

    accept() {
        this.response = CancelComponent.ACCEPT;
        if (this.closeAll) {
            this._dialogService.closeAllDialogs();
        }
        this._messageService.dismissSnackBar();
    }

    get response(): string {
        return this._response;
    }

    set response(value: string) {
        this._response = value;
    }

    get closeAll(): boolean {
        return this._closeAll;
    }

    set closeAll(value: boolean) {
        this._closeAll = value;
    }
}
