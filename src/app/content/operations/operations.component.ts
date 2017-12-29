import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {InfiniteScrollService} from './_services/infinite-scroll.service';
import {HistoricalSearchService} from './_services/historical-search.service';
import {ContingencyService} from './_services/contingency.service';

@Component({
    selector: 'lsl-operations',
    templateUrl: './operations.component.html',
    styleUrls: ['./operations.component.scss']
})

export class OperationsComponent implements OnInit {

    public arrMenu: { label: string, link: string }[];

    constructor(
        private translate: TranslateService,
        public infiniteScrollService: InfiniteScrollService,
        public historicalSearchService: HistoricalSearchService
    ) {
        this.translate.setDefaultLang('en');
        this.arrMenu = [
            {
                'label': 'OPERATIONS.AOG_CONTINGENCY',
                'link': '/operations/contingencies' + (this.historicalSearchService.active ? '/historical' : ''),
            },
            {
                'label': 'OPERATIONS.PIT_STOP',
                'link': '/operations/pit-stop' + (this.historicalSearchService.active ? '/historical' : ''),
            }
        ];
    }

    ngOnInit() {
    }
}
