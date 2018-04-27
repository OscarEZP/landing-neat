import {Component, OnDestroy, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {HistoricalSearchService} from '../_services/historical-search.service';
import {RoutingService} from '../../shared/_services/routing.service';
import {LayoutService} from '../../layout/_services/layout.service';
import {DetailsService} from '../../details/_services/details.service';

@Component({
    selector: 'lsl-operations',
    templateUrl: './operations.component.html',
    styleUrls: ['./operations.component.scss']
})

export class OperationsComponent implements OnInit, OnDestroy {

    public arrMenu: { label: string, link: string }[];

    constructor(
        private translate: TranslateService,
        public historicalSearchService: HistoricalSearchService,
        private _routingService: RoutingService,
        private _layoutService: LayoutService,
        private _detailsService: DetailsService
    ) {
        this.translate.setDefaultLang('en');
        this.moduleTitle = 'Operations Module';
        this.arrMenu = [
            {
                'label': 'OPERATIONS.CONTINGENCY',
                'link': '/operations/contingencies' + (this.historicalSearchService.active ? '/historical' : ''),
            },
            {
                'label': 'OPERATIONS.PENDINGS',
                'link': '/operations/pendings',
            }
        ];
        this.showAddButton = true;
        this.showRightNav = true;
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this._detailsService.closeSidenav();
    }

    set moduleTitle(value: string) {
        this._routingService.moduleTitle = value;
    }

    set showAddButton(value: boolean) {
        this._layoutService.showAddButton = value;
    }

    set showRightNav(value: boolean) {
        this._layoutService.showRightNav = value;
    }
}
