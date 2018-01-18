import { Component } from '@angular/core';
import { ContingencyService } from '../../content/operations/_services/contingency.service';
import { DetailsService } from '../../details/_services/details.service';

@Component({
    selector: 'lsl-rightnav',
    templateUrl: './rightnav.component.html',
    styleUrls: ['./rightnav.component.scss']
})
export class RightnavComponent {

    private _activeSection: string;

    constructor(private _detailsService: DetailsService, private _contingencyService: ContingencyService) {
        this.activeSection = null;
    }

    get activeSection(): string {
        return this._activeSection;
    }

    set activeSection(value: string) {
        this._activeSection = value;
    }

    public openDetails(section: string = 'information') {
        this._detailsService.openDetails(section);
        return this.activeSection = section;
    }

    public closeDetails() {
        this._detailsService.closeSidenav().then();
    }

    public isDisabled(): boolean {
        return this._contingencyService.contingencyList.length === 0;
    }
}
