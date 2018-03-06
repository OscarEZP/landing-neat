import {Component, OnInit} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {Contingency} from '../shared/_models/contingency/contingency';
import {DetailsService} from './_services/details.service';

@Component({
    selector: 'lsl-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

    private _asideVisible: boolean;
    private _activeTitle: string;
    private _selectedContingency: Contingency;
    private _contingencySubcription: Subscription;

    constructor(private _detailsService: DetailsService) {

        this.asideVisible = false;
        this.activeTitle = '';
        this.selectedContingency = Contingency.getInstance();
    }

    get asideVisible(): boolean {
        return this._asideVisible;
    }

    set asideVisible(value: boolean) {
        this._asideVisible = value;
    }

    get activeTitle(): string {
        return this._activeTitle;
    }

    set activeTitle(value: string) {
        this._activeTitle = value;
    }

    get selectedContingency(): Contingency {
        return this._selectedContingency;
    }

    set selectedContingency(value: Contingency) {
        this._selectedContingency = value;
    }

    get contingencySubcription(): Subscription {
        return this._contingencySubcription;
    }

    set contingencySubcription(value: Subscription) {
        this._contingencySubcription = value;
    }

    ngOnInit() {
        this.contingencySubcription = this._detailsService.selectedContingencyChange.subscribe(contingency => this.selectedContingency = contingency);

        this.asideVisible = this._detailsService.isOpen;
        this.activeTitle = this._detailsService.activeTitle;
        this.selectedContingency = this._detailsService.selectedContingency;
    }
}
