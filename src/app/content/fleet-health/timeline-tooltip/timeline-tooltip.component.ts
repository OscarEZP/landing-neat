import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
    selector: 'lsl-tooltip',
    templateUrl: './timeline-tooltip.component.html',
    styleUrls: ['./timeline-tooltip.component.scss']
})
export class TimelineTooltipComponent implements OnInit, OnDestroy {

    constructor() {
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }

    public show(event: Event) {
        console.log('show component!', event);
    }
}
