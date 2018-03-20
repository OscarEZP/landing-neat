import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Task} from '../../../../shared/_models/task/task';
import {Analysis} from '../../../../shared/_models/task/analysis/analysis';

@Component({
    selector: 'lsl-tooltip',
    templateUrl: './timeline-tooltip.component.html',
    styleUrls: ['./timeline-tooltip.component.scss']
})
export class TimelineTooltipComponent implements OnInit, OnDestroy {

    @Input()
    public task: Task;
    private _analysis: Analysis;

    constructor() {
        this._analysis = Analysis.getInstance();
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }

    public checkStatus() {
        this._analysis.barcode = this.task.barcode;
        console.log(this.analysis);
    }

    get analysis(): Analysis {
        return this._analysis;
    }

    set analysis(value: Analysis) {
        this._analysis = value;
    }

    get status(): string {
        return this._analysis.status;
    }

    set status(value: string) {
        this._analysis.status = value;
    }

}
