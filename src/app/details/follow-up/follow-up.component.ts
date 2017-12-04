import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'lsl-follow-up',
    templateUrl: './follow-up.component.html',
    styleUrls: ['./follow-up.component.css']
})
export class FollowUpComponent implements OnInit {

    constructor() {
    }

    ngOnInit() {
    }

    bla(event){
        console.log(event);
    }

}
