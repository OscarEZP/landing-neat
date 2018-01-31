import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '../../../shared/_services/message.service';
import { ApiRestService } from '../../../shared/_services/apiRest.service';
import { Aircraft } from '../../../shared/_models/aircraft';
import { ContingencyService } from '../_services/contingency.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HistoricalSearchService } from '../_services/historical-search.service';
import { InfiniteScrollService } from '../_services/infinite-scroll.service';
import {MatDatepickerInputEvent} from '@angular/material';
import { DateUtil } from '../../../shared/util/dateUtil';
import { GroupTypes } from '../../../shared/_models/configuration/groupTypes';
import { TimeInstant } from '../../../shared/_models/timeInstant';
import { SearchContingency } from '../../../shared/_models/contingency/searchContingency';
// import {  } from

@Component({
    selector: 'lsl-search-historical',
    templateUrl: './search-historical.component.html',
    styleUrls: ['./search-historical.component.scss']
})

export class SearchHistoricalComponent implements OnInit {

    private static RANGE_DATE_HISTORICAL = 'RANGE_DATE_HISTORICAL';
    private static HISTORICAL_URL = '/operations/contingencies/historical';
    private static VALIDATION_ERROR_MESSAGE = 'OPERATIONS.VALIDATION_ERROR_MESSAGE';

    public searchForm: FormGroup;
    public snackbarMessage: string;
    public aicraftList: Aircraft[];
    public maxDate: Date;
    public minFrom: Date;
    public minTo: Date;
    public selectedOptions = [];

    constructor(
        public translate: TranslateService,
        public messageService: MessageService,
        public apiRestService: ApiRestService,
        private router: Router,
        private route: ActivatedRoute,
        private _contingencyService: ContingencyService,
        private _searchHistoricalService: HistoricalSearchService,
        private _infiniteScrollService: InfiniteScrollService,
    ) {
        this.translate.setDefaultLang('en');
        this.searchHistoricalService.initForm(
            {
                tails: new FormControl('', {
                    validators: Validators.required,
                    updateOn: 'change'
                }),
                from: new FormControl('', {
                    validators: Validators.required,
                    updateOn: 'submit'
                }),
                to: new FormControl('', {
                    validators: Validators.required,
                    updateOn: 'submit'
                })
            }
        );
        this.searchForm = this.searchHistoricalService.searchForm;
        this.maxDate = new Date();
        this.minFrom = new Date();
        this.minTo = new Date();
    }

    get contingencyService(): ContingencyService {
        return this._contingencyService;
    }

    get searchHistoricalService(): HistoricalSearchService {
        return this._searchHistoricalService;
    }

    get infiniteScrollService(): InfiniteScrollService {
        return this._infiniteScrollService;
    }

    ngOnInit() {
        this.getAircraft();
        this.setMinDate();
    }

    private setMinDate() {
        this.apiRestService.getSingle('configTypes', SearchHistoricalComponent.RANGE_DATE_HISTORICAL).subscribe(rs => {
            const res = rs as GroupTypes;
            const day = Number(res.types[0].code);
            const today = new Date();
            const todayUtil = DateUtil.getUTCDate(today.getTime(), -(24 * day));
            this.minFrom = new Date(todayUtil);
        });
    }

    public onSelectFrom(event: MatDatepickerInputEvent<Date>): void {
        this.minTo = new Date(event.value);
    }

    private getAircraft(): void {
        const searchSignature = {
            enable: 2
        };
        this.contingencyService.getAircrafts(searchSignature).subscribe((data) => {
            this.aicraftList = data as Aircraft[];
        });
    }

    private translateString(toTranslate: string) {
        this.translate.get(toTranslate).subscribe((res: string) => {
            this.snackbarMessage = res;
        });
    }

    public clearSearch(): void {
        this.searchHistoricalService.searchForm.reset();
        this.infiniteScrollService.init();
        this.router.navigate(['../'], {relativeTo: this.route});
    }

    public getSearchContingency(): SearchContingency {
        return new SearchContingency(
            this.infiniteScrollService.offset,
            this.infiniteScrollService.pageSize,
            this.searchHistoricalService.tails,
            new TimeInstant(this.searchHistoricalService.fromTS, ''),
            new TimeInstant(this.searchHistoricalService.toTS, ''),
            true,
            false
        );
    }

    public submitForm(value: any) {
        this.searchHistoricalService.searchForm.updateValueAndValidity();
        if (this.searchHistoricalService.searchForm.valid) {
            this.infiniteScrollService.init();
            const search = this.getSearchContingency();
            this.contingencyService.loading = true;
            this.contingencyService.postHistoricalSearch(search).subscribe(() => {
                this.contingencyService.loading = false;
            });
            this.contingencyService.getTotalRecords(search).subscribe();
            if (!this.searchHistoricalService.active) {
                this.router.navigate([SearchHistoricalComponent.HISTORICAL_URL]);
            }
        } else {
            this.translateString(SearchHistoricalComponent.VALIDATION_ERROR_MESSAGE);
            this.messageService.openSnackBar(this.snackbarMessage);
        }
    }

    public onSelect(option: any): void {
        if (option.selected) {
            this.selectedOptions = [];
            this.aicraftList.forEach(ac => {
                this.selectedOptions.push(ac.tail);
            });
            this.selectedOptions.push('ALL');
        } else {
            this.selectedOptions = [];
        }
    }

}
