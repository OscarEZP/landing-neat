import {Component, EventEmitter, Input, Output, OnDestroy, OnInit} from '@angular/core';
import {Task} from '../../../../shared/_models/task/task';
import {Review} from '../../../../shared/_models/task/analysis/review';

@Component({
    selector: 'lsl-tooltip',
    templateUrl: './timeline-tooltip.component.html',
    styleUrls: ['./timeline-tooltip.component.scss']
})
export class TimelineTooltipComponent implements OnInit, OnDestroy {

    @Input()
    public task: Task;

    @Output()
    public onApply: EventEmitter<Review> = new EventEmitter();

    private _review: Review;

    constructor() {
        this._review = Review.getInstance();
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }

    public checkStatus() {
        this.review.barcode = this.task.barcode;
        this.onApply.emit(this.review);
    }

    get review(): Review {
        return this._review;
    }

    set review(value: Review) {
        this._review = value;
    }

    get status(): string {
        return this._review.status;
    }

    set status(value: string) {
        this._review.status = value;
    }

}
