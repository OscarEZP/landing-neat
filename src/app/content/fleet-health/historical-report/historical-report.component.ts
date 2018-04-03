import {Component, OnDestroy, OnInit} from '@angular/core';
import { DialogService } from '../../_services/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { Task } from '../../../shared/_models/task/task';
import {TimelineTooltipComponent} from './timeline-tooltip/timeline-tooltip.component';
import {HistoricalReportService} from './_services/historical-report.service';
import {DataService} from '../../../shared/_services/data.service';


@Component({
    selector: 'lsl-historical-report',
    templateUrl: './historical-report.component.html',
    styleUrls: ['./historical-report.component.scss'],
    providers: [
        TimelineTooltipComponent
    ]
})
export class HistoricalReportComponent implements OnInit, OnDestroy {

    private _task: Task;

    constructor(
        private _dialogService: DialogService,
        private _translate: TranslateService,
        private _historicalReportService: HistoricalReportService,
        private _messageData: DataService
    ) {
        this._translate.setDefaultLang('en');
    }

    ngOnInit() {
        this.task = this._historicalReportService.task;
    }

    ngOnDestroy() {
        this._historicalReportService.isAtaCorrected = false;
    }

    public openCancelDialog(): void {
        this._dialogService.closeAllDialogs();
        this._messageData.stringMessage('reload');
    }

    get task(): Task {
        return this._task;
    }

    set task(value: Task) {
        this._task = value;
    }

    get newAta(): string {
        return this._historicalReportService.newAta;
    }

    get isAtaCorrected(): boolean {
        return this._historicalReportService.isAtaCorrected;
    }

    set isAtaCorrected(value: boolean) {
        this._historicalReportService.isAtaCorrected = value;
    }
}
