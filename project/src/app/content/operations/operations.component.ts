import {Component, OnInit, ViewChild} from '@angular/core';
import {ContingenceListComponent} from './contingenceList.component/contingenceList.component';

@Component({
    selector: 'lsl-operations',
    templateUrl: './operations.component.html',
    styleUrls: ['./operations.component.scss']
})

export class OperationsComponent implements OnInit {

    private itemsCount: number;

    @ViewChild(ContingenceListComponent) child;

    constructor() { }

    ngOnInit() {
        this.itemsCount = this.child.contingenceLength;
    }

    receiveMessage($event) {
        this.itemsCount = $event;
    }

}
