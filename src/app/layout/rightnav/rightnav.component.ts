import { Component, OnInit } from '@angular/core';
import { DetailsService } from '../../details/_services/details.service';

@Component({
    selector: 'lsl-rightnav',
    templateUrl: './rightnav.component.html',
    styleUrls: ['./rightnav.component.scss']
})
export class RightnavComponent implements OnInit {

    constructor(public detailsService: DetailsService) {
    }

    ngOnInit() {
    }

    openDetails(section: string = 'information') {
        this.detailsService.openDetails(section);
    }

    closeDetails() {
        this.detailsService.closeSidenav().then(() => {
            this.detailsService.open = false;
        });
    }

}
