import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../../shared/_services/message.service';
import { DialogService } from '../../_services/dialog.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'lsl-timeline',
    templateUrl: './timeline.component.html',
    styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

    constructor(
        private messageService: MessageService,
        private dialogService: DialogService,
        public translate: TranslateService
    ) {
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
