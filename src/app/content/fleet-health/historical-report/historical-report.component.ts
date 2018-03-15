import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../_services/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { Task } from '../../../shared/_models/task/task';
import {TimelineTooltipComponent} from './timeline-tooltip/timeline-tooltip.component';
import {FleetHealthService} from '../_services/fleet-health.service';


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
        private _dialogService: DialogService,
        private _translate: TranslateService,
        private _fleetHealthService: FleetHealthService
    ) {
        this._translate.setDefaultLang('en');
    }

    ngOnInit() {
        this._task = this._fleetHealthService.task;
    }

    public openCancelDialog(): void {
        this._dialogService.closeAllDialogs();
    }

    get task(): Task {
        return this._task;
    }

}
