import {Component, EventEmitter, Input, Output, OnDestroy, OnInit} from '@angular/core';
import {Review} from '../../../../shared/_models/task/analysis/review';
import {Task} from '../../../../shared/_models/task/task';
import {TimelineTask} from '../../../../shared/_models/task/timelineTask';

@Component({
    selector: 'lsl-tooltip',
    templateUrl: './timeline-tooltip.component.html',
    styleUrls: ['./timeline-tooltip.component.scss']
})
export class TimelineTooltipComponent implements OnInit, OnDestroy {

    @Input()
    public timelineTaskData: object;

    @Output()
    public onApply: EventEmitter<Review> = new EventEmitter();

    private _review: Review;
    private _timelineTask: TimelineTask;
    private _task: Task;

    constructor() {
        this._review = Review.getInstance();
    }

    ngOnInit(): void {
        this.timelineTask = this.timelineTaskData['data'];
        this.task = this.timelineTask.task;
        if (this.timelineTask.apply !== null) {
            this.review.status = this.timelineTask.apply ? 'apply' : 'dontApply';
        }
    }

    ngOnDestroy(): void {
    }

    public checkStatus() {
        this.review.barcode = this.timelineTaskData.data.task.barcode;
        this.onApply.emit(this.review);
    }

    get review(): Review {
        return this._review;
    }

    get status(): string {
        return this._review.status;
    }

    set status(value: string) {
        this._review.status = value;
    }

    get timelineTask(): TimelineTask {
        return this._timelineTask;
    }

    set timelineTask(value: TimelineTask) {
        this._timelineTask = value;
    }

    get task(): Task {
        return this._task;
    }

    set task(value: Task) {
        this._task = value;
    }
}
