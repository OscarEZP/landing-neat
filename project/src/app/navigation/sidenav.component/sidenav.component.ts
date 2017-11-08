import {Component, EventEmitter, Output, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'lsl-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.css'],
    encapsulation: ViewEncapsulation.None,
    preserveWhitespaces: false,
})

export class SidenavComponent {

    @Output() sidenavToggle: EventEmitter <SidenavComponent> = new EventEmitter();
    onClose: any;

    constructor() {
    }


}
