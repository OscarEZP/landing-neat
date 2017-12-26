import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MatPaginator} from '@angular/material';
import {InfiniteScrollService} from './_services/infinite-scroll.service';
import {HistoricalSearchService} from './_services/historical-search.service';
import {ContingencyService} from './_services/contingency.service';

@Component({
    selector: 'lsl-operations',
    templateUrl: './operations.component.html',
    styleUrls: ['./operations.component.scss']
})

export class OperationsComponent implements OnInit {

    @ViewChild('contPaginator') public paginator: MatPaginator;
    public arrMenu: { label: string, link: string }[];

    constructor(
        private translate: TranslateService,
        public infiniteScrollService: InfiniteScrollService,
        public historicalSearchService: HistoricalSearchService,
        private _contingencyService: ContingencyService
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
        this.paginator.page.subscribe((page) => {
            this.infiniteScrollService.pageSize = page.pageSize;
            this.infiniteScrollService.pageIndex = page.pageIndex;
            const search = {
                from: {
                    epochTime: this.historicalSearchService.fromTS
                },
                to: {
                    epochTime: this.historicalSearchService.toTS
                },
                offSet: this.infiniteScrollService.offset,
                limit: this.infiniteScrollService.pageSize
            };
            this._contingencyService.postHistoricalSearch(search).subscribe();
        });
    }
}
