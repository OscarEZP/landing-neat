import {Component, OnDestroy, OnInit} from '@angular/core';
import { ContingencyService } from '../../content/_services/contingency.service';
import { DetailsService } from '../../details/_services/details.service';
import {Layout, LayoutService} from '../_services/layout.service';
import {Subscription} from 'rxjs/Subscription';
import {DetailsServiceAog} from '../../details/_services/details_aog.service';

@Component({
    selector: 'lsl-rightnav',
    templateUrl: './rightnav.component.html',
    styleUrls: ['./rightnav.component.scss']
})
export class RightnavComponent implements OnInit, OnDestroy {

    private _activeSection: string;
    private _layoutSubs: Subscription;
    private _layout: Layout;

    constructor(
        private _detailsService: DetailsService,
        private _detailsServiceAog: DetailsServiceAog,
        private _contingencyService: ContingencyService,
        private _layoutService: LayoutService
    ) {
        this._activeSection = null;
        this._layout = null;
    }

    ngOnInit(): void {
        this._layoutSubs = this.getLayoutSubs();
    }

    ngOnDestroy(): void {
        this._layoutSubs.unsubscribe();
    }

    private getLayoutSubs() {
        return this._layoutService.layout$
            .subscribe(v => this.layout = v);
    }

    public openDetails(section: string = 'information', toDoList: string) {
        console.log('section', section);
        if (toDoList === 'Aog') {
            this._detailsServiceAog.openDetails(section);
        }

        if (toDoList === 'Contingency') {
            this._detailsService.openDetails(section);
        }
        return this.activeSection = section;
    }

    public closeDetails() {
        this._detailsService.closeSidenav().then();
    }

    public isDisabled(): boolean {
        return this.layout.disableRightNav;
    }

    get activeSection(): string {
        return this._activeSection;
    }

    set activeSection(value: string) {
        this._activeSection = value;
    }

    get layout(): Layout {
        return this._layout;
    }

    set layout(value: Layout) {
        this._layout = value;
    }
}
