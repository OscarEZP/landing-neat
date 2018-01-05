import { Component, OnInit } from '@angular/core';
import { DetailsService } from '../../details/_services/details.service';
import { ContingencyService } from '../../content/operations/_services/contingency.service';

@Component({
    selector: 'lsl-rightnav',
    templateUrl: './rightnav.component.html',
    styleUrls: ['./rightnav.component.scss']
})
export class RightnavComponent implements OnInit {

    constructor(public detailsService: DetailsService,
                public contingencyService: ContingencyService) {
    }

    ngOnInit() {
    }

    openDetails(section: string = 'information') {
        this.detailsService.openDetails(section);
    }

    closeDetails() {
        this.detailsService.closeSidenav().then();
    }

    public isDisabled(): boolean {
        return this.contingencyService.data.length === 0 ? true : false;
    }
}
