import { Component, OnInit } from '@angular/core';
import { DetailsService } from '../../details/_services/details.service';
import { ScrollService } from '../../shared/_services/scrolling.service';

@Component({
    selector: 'lsl-rightnav',
    templateUrl: './rightnav.component.html',
    styleUrls: ['./rightnav.component.scss'],
    providers: [ ScrollService ]
})
export class RightnavComponent implements OnInit {

    constructor(public detailsService: DetailsService,
                private _scrollService: ScrollService
    ) {
    }

    ngOnInit() {

    }

    openDetails(section: string = 'information') {
        this.detailsService.setActive(section);
        section = 'details-' + section;
        if (!this.detailsService.getOpened()) {
            this.detailsService.openSidenav().then(() => {
                this._scrollService.scrollTo(section);
                this.detailsService.setOpened(true);
            });
        }else{
            this._scrollService.scrollTo(section);
        }
    }

    closeDetails() {
        this.detailsService.closeSidenav().then(() => {
            this.detailsService.setOpened(false);
        });
    }

}
