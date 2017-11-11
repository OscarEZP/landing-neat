import {Component, OnInit, ViewChild} from '@angular/core';
import {ContingenceListComponent} from "./contingenceList.component/contingenceList.component";

@Component({
    selector: 'lsl-contingences',
    templateUrl: './contingences.component.html',
    styleUrls: ['./contingences.component.css']
})

export class ContingencesComponent implements OnInit {

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
