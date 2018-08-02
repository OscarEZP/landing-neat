import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '../../../shared/_services/message.service';
import { ApiRestService } from '../../../shared/_services/apiRest.service';
import { Aircraft } from '../../../shared/_models/aircraft';
import { ContingencyService } from '../../_services/contingency.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HistoricalSearchService } from '../../_services/historical-search.service';
import { PaginatorObjectService } from '../../_services/paginator-object.service';
import {MatDatepickerInputEvent} from '@angular/material';
import { DateUtil } from '../../../shared/util/dateUtil';
import { GroupTypes } from '../../../shared/_models/configuration/groupTypes';
import { TimeInstant } from '../../../shared/_models/timeInstant';
import { SearchContingency } from '../../../shared/_models/contingency/searchContingency';
import {Subscription} from 'rxjs/Subscription';
import {LayoutService} from '../../../layout/_services/layout.service';

@Component({
    selector: 'lsl-search-historical',
    templateUrl: './search-historical.component.html',
    styleUrls: ['./search-historical.component.scss']
})

export class SearchHistoricalComponent implements OnInit {

    private static RANGE_DATE_HISTORICAL = 'RANGE_DATE_HISTORICAL';
    private static HISTORICAL_URL = '/operations/contingencies/historical';
    private static VALIDATION_ERROR_MESSAGE = 'OPERATIONS.VALIDATION_ERROR_MESSAGE';

    private _term: string;
    private _searchForm: FormGroup;
    private _snackbarMessage: string;
    private _aicraftList: Aircraft[];
    private _maxDate: Date;
    private _minFrom: Date;
    private _minTo: Date;
    private _selectedOptions = [];

    constructor(
        private _translate: TranslateService,
        private _messageService: MessageService,
        private _apiRestService: ApiRestService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _contingencyService: ContingencyService,
        private _searchHistoricalService: HistoricalSearchService,
        private _layoutService: LayoutService
    ) {
        this._translate.setDefaultLang('en');
        this._searchHistoricalService.initForm(
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
    }

    get term(): string {
        return this._term;
    }

    set term(value: string) {
        this._term = value;
    }

    get searchForm(): FormGroup {
        return this._searchForm;
    }

    set searchForm(value: FormGroup) {
        this._searchForm = value;
    }

    get snackbarMessage(): string {
        return this._snackbarMessage;
    }

    set snackbarMessage(value: string) {
        this._snackbarMessage = value;
    }

    get aicraftList(): Aircraft[] {
        return this._aicraftList;
    }

    set aicraftList(value: Aircraft[]) {
        this._aicraftList = value;
    }

    get maxDate(): Date {
        return this._maxDate;
    }

    set maxDate(value: Date) {
        this._maxDate = value;
    }

    get minFrom(): Date {
        return this._minFrom;
    }

    set minFrom(value: Date) {
        this._minFrom = value;
    }

    get minTo(): Date {
        return this._minTo;
    }

    set minTo(value: Date) {
        this._minTo = value;
    }

    get selectedOptions(): any[] {
        return this._selectedOptions;
    }

    set selectedOptions(value: any[]) {
        this._selectedOptions = value;
    }

    get paginatorObject(): PaginatorObjectService {
        return this._searchHistoricalService.paginatorObjectService;
    }

    set paginatorObject(value: PaginatorObjectService) {
        this._searchHistoricalService.paginatorObjectService = value;
    }

    ngOnInit() {
        this.maxDate = new Date();
        this.minFrom = new Date();
        this.minTo = new Date();
        this.searchForm = this._searchHistoricalService.searchForm;
        this.getAircraft();
        this.setMinDate();
    }

    private setMinDate() {
        this._apiRestService.getSingle('configTypes', SearchHistoricalComponent.RANGE_DATE_HISTORICAL).subscribe(rs => {
            const res = rs as GroupTypes;
            const day = Number(res.types[0].code);
            const today = new Date();
            const todayUtil = DateUtil.getUTCDate(today.getTime(), -(24 * day));
            this._minFrom = new Date(todayUtil);
        });
    }

    public onSelectFrom(event: MatDatepickerInputEvent<Date>): void {
        this._minTo = new Date(event.value);
    }

    private getAircraft(): void {
        const searchSignature = {
            enable: 2
        };
        this._contingencyService.getAircrafts(searchSignature).subscribe((data) => {
            this.aicraftList = data as Aircraft[];
        });
    }

    private translateString(toTranslate: string): Subscription {
        return this._translate.get(toTranslate).subscribe((res: string) => {
            this.snackbarMessage = res;
        });
    }

    public clearSearch(): void {
        this.searchForm.reset();
        this._router.navigate(['../'], {relativeTo: this._route});
    }

    private getSearchContingency(): SearchContingency {
        return new SearchContingency(
            this.paginatorObject.offset,
            this.paginatorObject.pageSize,
            this._searchHistoricalService.tails,
            new TimeInstant(this._searchHistoricalService.fromTS, ''),
            new TimeInstant(this._searchHistoricalService.toTS, ''),
            true,
            false
        );
    }

    public submitForm() {
        this.searchForm.updateValueAndValidity();
        if (this.searchForm.valid) {
            const search = this.getSearchContingency();
            this._contingencyService.loading = true;
            this._contingencyService.postHistoricalSearch(search).subscribe(() => {
                this._contingencyService.loading = false;
                this._layoutService.disableRightNav = this._contingencyService.contingencyList.length === 0;
            });
            this._contingencyService.getTotalRecords(search).subscribe((count) => {
                this.paginatorObject.length = count.items;
            });
            if (!this._searchHistoricalService.active) {
                this._router.navigate([SearchHistoricalComponent.HISTORICAL_URL]);
            }
        } else {
            this.translateString(SearchHistoricalComponent.VALIDATION_ERROR_MESSAGE);
            this._messageService.openSnackBar(this.snackbarMessage);
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
