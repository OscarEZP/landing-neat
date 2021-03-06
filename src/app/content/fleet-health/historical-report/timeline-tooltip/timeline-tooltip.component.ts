import {Component, EventEmitter, Input, Output, OnDestroy, OnInit} from '@angular/core';
import {Review} from '../../../../shared/_models/task/fleethealth/analysis/review';
import {Task} from '../../../../shared/_models/task/task';
import {TimelineTask} from '../../../../shared/_models/task/timelineTask';

@Component({
    selector: 'lsl-tooltip',
    templateUrl: './timeline-tooltip.component.html',
    styleUrls: ['./timeline-tooltip.component.scss']
})
export class TimelineTooltipComponent implements OnInit, OnDestroy {

    @Input()
    set timelineTaskData(value: object) {
        this._timelineTaskData = value;
        this.updateTask();
    }

    @Output()
    public onApply: EventEmitter<Review> = new EventEmitter();

    private _review: Review;
    private _timelineTask: TimelineTask;
    private _task: Task;
    private _timelineTaskData: object;

    constructor() {
        this._review = Review.getInstance();
    }

    ngOnInit(): void {
        this.updateTask();
    }

    ngOnDestroy(): void {
    }

    private updateTask() {
        this.timelineTask = this.timelineTaskData['data'];
        this.task = this.timelineTask.task;
        this.review.apply = this.timelineTask.apply !== null ? this.timelineTask.apply : null;
    }

    public checkStatus() {
        this.review.barcode = this.timelineTask.task.barcode;
        this.onApply.emit(this.review);
    }

    get review(): Review {
        return this._review;
    }

    get apply(): string {
        if (this.review.apply !== null) {
            return this.review.apply.toString();
        } else {
            return '';
        }
    }

    set apply(value: string) {
        this.review.apply = value === 'true';
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

    get timelineTaskData(): object {
        return this._timelineTaskData;
    }
}
