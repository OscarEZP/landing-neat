import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {SidenavComponent} from '../sidenav.component/sidenav.component';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'lsl-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements AfterViewInit {
    @ViewChild('mySidenav')
    sidenav: SidenavComponent;

    susbscription: Subscription;

    ngAfterViewInit(): void {
        this.susbscription = this.sidenav.onClose.subscribe(() =>
            console.log('Closed event from observable'));
    }

    onClose(): void {
        console.log('Closed event from template');
    }

}
