import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {HistoricalSearchService} from './_services/historical-search.service';

@Component({
    selector: 'lsl-operations',
    templateUrl: './operations.component.html',
    styleUrls: ['./operations.component.scss']
})

export class OperationsComponent implements OnInit {

    public arrMenu: { label: string, link: string }[];

    constructor(
        private translate: TranslateService,
        public historicalSearchService: HistoricalSearchService
    ) {
        this.translate.setDefaultLang('en');
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
    }

    ngOnInit() {
    }
}
