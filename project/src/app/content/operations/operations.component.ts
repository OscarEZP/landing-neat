import {Component, OnInit, ViewChild} from '@angular/core';
import {ContingencyListComponent} from './contingency-list.component/contingency-list.component';

@Component({
    selector: 'lsl-operations',
    templateUrl: './operations.component.html',
    styleUrls: ['./operations.component.scss']
})

export class OperationsComponent implements OnInit {

    private itemsCount: number;

    @ViewChild(ContingencyListComponent) child;

    constructor() { }

    ngOnInit() {
        this.itemsCount = this.child.contingenceLength;
    }

    receiveMessage($event) {
        this.itemsCount = $event;
    }

}
