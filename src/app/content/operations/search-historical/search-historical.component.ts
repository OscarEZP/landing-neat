import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '../../../shared/_services/message.service';
import { ApiRestService } from '../../../shared/_services/apiRest.service';
import { Aircraft } from '../../../shared/_models/aircraft';
import { ContingencyService} from '../_services/contingency.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HistoricalSearchService} from '../_services/historical-search.service';
import {InfiniteScrollService} from '../_services/infinite-scroll.service';

@Component({
    selector: 'lsl-search-historical',
    templateUrl: './search-historical.component.html',
    styleUrls: ['./search-historical.component.scss']
})

export class SearchHistoricalComponent implements OnInit {
    public searchForm: FormGroup;
    public snackbarMessage: string;
    public aicraftList: Aircraft[];

    constructor(
        public translate: TranslateService,
        public messageService: MessageService,
        public service: ApiRestService,
        private router: Router,
        private route: ActivatedRoute,
        private _contingencyService: ContingencyService,
        private _searchHistoricalService: HistoricalSearchService,
        public infiniteScrollService: InfiniteScrollService
    ) {
        this.translate.setDefaultLang('en');
        this.searchForm = this._searchHistoricalService.searchForm;
    }

    ngOnInit() {
        this.getAircraft();
    }

    private getAircraft(): void {
        const searchSignature = {
            enable: 2
        };
        this._contingencyService.getAircrafts(searchSignature).subscribe((data) => {
            this.aicraftList = data as Aircraft[];
        });
    }

    private translateString(toTranslate: string) {
        this.translate.get(toTranslate).subscribe((res: string) => {
            this.snackbarMessage = res;
        });
    }

    public clearSearch(): void {
        this.searchForm.controls['tails'].reset();
        this.searchForm.controls['from'].reset();
        this.searchForm.controls['to'].reset();
        this.router.navigate(['../'], {relativeTo: this.route});
    }

    submitForm(value: any) {
        if (this.searchForm.valid) {
            if (!this._searchHistoricalService.active) {
                this.router.navigate([this.router.url + '/historical']);
            } else {
                const search = {
                    from: {
                        epochTime: this._searchHistoricalService.fromTS
                    },
                    to: {
                        epochTime: this._searchHistoricalService.toTS
                    },
                    offSet: this.infiniteScrollService.offset,
                    limit: this.infiniteScrollService.pageSize
                };
                this._contingencyService.postHistoricalSearch(search).subscribe();
            }
        } else {
            this.translateString('OPERATIONS.VALIDATION_ERROR_MESSAGE');
            this.messageService.openSnackBar(this.snackbarMessage);
        }
    }

}
