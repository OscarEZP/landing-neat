import { Component, OnInit, Inject } from '@angular/core';
import { MessageService } from '../../../shared/_services/message.service';
import { DialogService } from '../../_services/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Task } from '../../../shared/_models/task/task';
import {TimelineTooltipComponent} from '../timeline-tooltip/timeline-tooltip.component';


@Component({
    selector: 'lsl-historical-report',
    templateUrl: './historical-report.component.html',
    styleUrls: ['./historical-report.component.scss'],
    providers: [
        TimelineTooltipComponent
    ]
})
export class HistoricalReportComponent implements OnInit {

    private _task: Task;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _messageService: MessageService,
        private _dialogService: DialogService,
        private _translate: TranslateService
    ) {
        this._translate.setDefaultLang('en');
    }

    ngOnInit() {
        this._task = this.data;
    }

    public openCancelDialog(): void {
        // if (this.validateFilledItems()) {
        //     this.getTranslateString('OPERATIONS.CANCEL_COMPONENT.MESSAGE');
        //     this._messageService.openFromComponent(CancelComponent, {
        //         data: {message: this.snackbarMessage},
        //         horizontalPosition: 'center',
        //         verticalPosition: 'top'
        //     });
        // } else {
        this._dialogService.closeAllDialogs();
        // }
    }

    get task(): Task {
        return this._task;
    }

}
