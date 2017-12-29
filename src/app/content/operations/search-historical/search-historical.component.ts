import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '../../../shared/_services/message.service';
import { ApiRestService } from '../../../shared/_services/apiRest.service';
import { Aircraft } from '../../../shared/_models/aircraft';
import { ContingencyService } from '../_services/contingency.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HistoricalSearchService } from '../_services/historical-search.service';
import { InfiniteScrollService } from '../_services/infinite-scroll.service';
import { MatDatepickerInputEvent } from '@angular/material';

@Component({
    selector: 'lsl-search-historical',
    templateUrl: './search-historical.component.html',
    styleUrls: ['./search-historical.component.scss']
})

export class SearchHistoricalComponent implements OnInit {
    public searchForm: FormGroup;
    public snackbarMessage: string;
    public aicraftList: Aircraft[];
    public maxDate: Date;
    public minFrom: Date;
    public minTo: Date;

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
        this.searchForm = this._searchHistoricalService.searchForm;
        this.maxDate = new Date();
        this.minFrom = new Date();
        this.minTo = new Date();
    }

    ngOnInit() {
        this.getAircraft();
        this.setMinDate();
    }

    private setMinDate(): void {
        const today = new Date();
        const newDate = new Date(today);
        newDate.setDate(newDate.getDate() - 60);
        this.minFrom = new Date(newDate);
    }

    public onSelectFrom(event: MatDatepickerInputEvent<Date>): void {
        this.minTo = new Date(event.value);
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
        this._searchHistoricalService.searchForm.reset();
        this.router.navigate(['../'], {relativeTo: this.route});
        this._contingencyService.getContingencies().subscribe();
    }

    submitForm(value: any) {
        console.log(this._searchHistoricalService.searchForm);
        this._searchHistoricalService.searchForm.updateValueAndValidity();
        if (this._searchHistoricalService.searchForm.valid) {
            const search = {
                from: {
                    epochTime: this._searchHistoricalService.fromTS
                },
                to: {
                    epochTime: this._searchHistoricalService.toTS
                },
                tails: this._searchHistoricalService.tails,
                offSet: this.infiniteScrollService.offset,
                limit: this.infiniteScrollService.pageSize
            };
            this._contingencyService.postHistoricalSearch(search).subscribe();
            if (!this._searchHistoricalService.active) {
                this.router.navigate([this.router.url + '/historical']);
            }
        } else {
            this.translateString('OPERATIONS.VALIDATION_ERROR_MESSAGE');
            this.messageService.openSnackBar(this.snackbarMessage);
        }
    }

}
