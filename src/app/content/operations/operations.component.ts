import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {HistoricalSearchService} from '../_services/historical-search.service';
import {RoutingService} from '../../shared/_services/routing.service';
import {LayoutService} from '../../layout/_services/layout.service';

@Component({
    selector: 'lsl-operations',
    templateUrl: './operations.component.html',
    styleUrls: ['./operations.component.scss']
})

export class OperationsComponent implements OnInit {

    public arrMenu: { label: string, link: string }[];

    constructor(
        private translate: TranslateService,
        public historicalSearchService: HistoricalSearchService,
        private _routingService: RoutingService,
        private _layoutService: LayoutService
    ) {
        this.translate.setDefaultLang('en');
        this._routingService.moduleTitle = 'Operations Module';
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
        this._layoutService.showAddButton = true;
        this._layoutService.showRightNav = true;
    }

    ngOnInit() {
    }
}
