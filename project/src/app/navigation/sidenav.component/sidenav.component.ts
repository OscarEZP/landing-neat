import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'lsl-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
    private username: String;
    private mail: String;
    private arrMenu: {label:String,link:String}[];

    constructor() {
    }

    ngOnInit() {
        this.username = "Ignacio Pardo";
        this.mail = "ignacio.pardo@gmail.com";
        this.arrMenu = [{"label" :"Dashboard","link":""},{"label":"Operations Module","link":""}];

    }

}
