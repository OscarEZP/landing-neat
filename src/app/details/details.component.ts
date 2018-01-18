import { Component } from '@angular/core';
import { DetailsService } from './_services/details.service';

@Component({
    selector: 'lsl-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss']
})
export class DetailsComponent {

    private _asideVisible: boolean;

    constructor(public detailsService: DetailsService) {
        this.asideVisible = this.detailsService.isOpen;
    }

    get asideVisible(): boolean {
        return this._asideVisible;
    }

    set asideVisible(value: boolean) {
        this._asideVisible = value;
    }
}
