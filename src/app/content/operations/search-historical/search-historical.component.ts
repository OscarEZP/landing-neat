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
import { MatDatepickerInputEvent } from '@angular/material';
import { DateUtil } from '../../../shared/util/dateUtil';

@Component({
    selector: 'lsl-search-historical',
    templateUrl: './search-historical.component.html',
    styleUrls: ['./search-historical.component.scss']
})

export class SearchHistoricalComponent implements OnInit {
    static dateUtil: DateUtil = new DateUtil();
    public searchForm: FormGroup;
    public snackbarMessage: string;
    public aicraftList: Aircraft[];
    public maxDate: Date;
    public minFrom: Date;
    public minTo: Date;
    public selectedOptions = [];

    constructor(public translate: TranslateService,
                public messageService: MessageService,
                public service: ApiRestService,
                private router: Router,
                private route: ActivatedRoute,
                private _contingencyService: ContingencyService,
                private _searchHistoricalService: HistoricalSearchService,
                private _infiniteScrollService: InfiniteScrollService) {
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

    private setMinDate(): void {
        const today = new Date();
        const todayUtil = SearchHistoricalComponent.dateUtil.getUTCDate(today.getTime(), -(24 * 60));
        this.minFrom = new Date(todayUtil);
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
        this.router.navigate(['../'], {relativeTo: this.route});
    }

    submitForm(value: any) {
        this.searchHistoricalService.searchForm.updateValueAndValidity();
        if (this.searchHistoricalService.searchForm.valid) {
            const search = {
                from: {
                    epochTime: this.searchHistoricalService.fromTS
                },
                to: {
                    epochTime: this.searchHistoricalService.toTS
                },
                tails: this.isAllSelected(this.searchHistoricalService.tails) ? null : this.searchHistoricalService.tails,
                offSet: this.infiniteScrollService.offset,
                limit: this.infiniteScrollService.pageSize
            };
            this.contingencyService.postHistoricalSearch(search).subscribe();
            this.contingencyService.getTotalRecords(search).subscribe();
            if (!this.searchHistoricalService.active) {
                this.router.navigate([this.router.url + '/historical']);
            }
        } else {
            this.translateString('OPERATIONS.VALIDATION_ERROR_MESSAGE');
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

    private isAllSelected(selectedOptions): boolean {
        return selectedOptions.indexOf('ALL') === -1 ? false : true;
    }
}
