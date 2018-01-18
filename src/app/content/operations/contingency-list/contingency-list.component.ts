import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs/Subscription';
import {DetailsService} from '../../../details/_services/details.service';
import { Aircraft } from '../../../shared/_models/aircraft';
import { Backup } from '../../../shared/_models/backup';
import {Contingency} from '../../../shared/_models/contingency';
import { Flight } from '../../../shared/_models/flight';
import { Interval } from '../../../shared/_models/interval';
import { Safety } from '../../../shared/_models/safety';
import { Status } from '../../../shared/_models/status';
import { TimeInstant } from '../../../shared/_models/timeInstant';
import {DataService} from '../../../shared/_services/data.service';
import {DialogService} from '../../_services/dialog.service';
import {CloseContingencyComponent} from '../close-contingency/close-contingency.component';
import {ActivatedRoute} from '@angular/router';
import {HistoricalSearchService} from '../_services/historical-search.service';
import {ContingencyService} from '../_services/contingency.service';
import {InfiniteScrollService} from '../_services/infinite-scroll.service';
import {MatPaginator} from '@angular/material';

@Component({
    selector: 'lsl-contingency-list',
    templateUrl: './contingency-list.component.html',
    styleUrls: ['./contingency-list.component.scss'],
    providers: [DialogService]
})

export class ContingencyListComponent implements OnInit, OnDestroy {

    @ViewChild('contPaginator') public paginator: MatPaginator;

    private _messageSubscriptions: Subscription;
    private _reloadSubscription: Subscription;
    private _contingencyList: Contingency[];
    private _progressBarColor: string;
    private _currentUTCTime: number;
    private _selectedContingency: Contingency;

    constructor(private _messageData: DataService,
                private _dialogService: DialogService,
                private _route: ActivatedRoute,
                private _detailsService: DetailsService,
                private _historicalSearchService: HistoricalSearchService,
                private _contingencyService: ContingencyService,
                private _infiniteScrollService: InfiniteScrollService,
                private _translate: TranslateService) {
        this._translate.setDefaultLang('en');
        this.contingencyList = [];

        this.selectedContingency = new Contingency(null, new Aircraft(null, null, null), null, new TimeInstant(null, null), null, new Flight(null, null, null, new TimeInstant(null, null)), null, false, false, new Backup(null, new TimeInstant(null, null)), null, new Safety(null, null), new Status(null, null, null, new TimeInstant(null, null), null, new Interval(null, null), new Interval(null, null), null), null, null);
    }

    get contingencyList(): Contingency[] {
        return this._contingencyList;
    }

    set contingencyList(value: Contingency[]) {
        this._contingencyList = value;
    }

    get progressBarColor(): string {
        return this._progressBarColor;
    }

    set progressBarColor(value: string) {
        this._progressBarColor = value;
    }

    get currentUTCTime(): number {
        return this._currentUTCTime;
    }

    set currentUTCTime(value: number) {
        this._currentUTCTime = value;
    }

    get infiniteScrollService(): InfiniteScrollService {
        return this._infiniteScrollService;
    }

    get detailsService(): DetailsService {
        return this._detailsService;
    }

    get historicalSearchService(): HistoricalSearchService {
        return this._historicalSearchService;
    }

    get contingencyService(): ContingencyService {
        return this._contingencyService;
    }

    get selectedContingency(): Contingency {
        return this._selectedContingency;
    }

    set selectedContingency(value: Contingency) {
        this._selectedContingency = value;
    }

    ngOnInit() {
        this.currentUTCTime = 0;
        this.progressBarColor = 'primary';
        this._messageSubscriptions = this._messageData.currentNumberMessage.subscribe(message => this.currentUTCTime = message);
        this._reloadSubscription = this._messageData.currentStringMessage.subscribe(message => this.reloadList(message));
        this._route.data.subscribe((data: any) => {
            this.historicalSearchService.active = data.historical;
        });
        this.getContingencies();
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
            this.contingencyService.postHistoricalSearch(search).subscribe();
        });
    }

    /**
     * Method for check list status with two variables, data loaded and loading process,
     * if there is not data and the list is not loading, return false
     * @return {boolean}
     */
    public checkDataStatus(): boolean {
        return this.contingencyService.contingencyList.length > 0 && !this.contingencyService.loading;
    }

    /**
     * Method for opening contingency details component
     * @param contingency, object with contingency basic information
     * @param section, #id for scrolling movement
     */
    public openDetails(contingency: Contingency, section: string) {
        this.detailsService.activeContingencyChanged(contingency);
        this.detailsService.openDetails(section);
    }

    /**
     * Event when component is destroyed
     */
    public ngOnDestroy() {
        this._messageSubscriptions.unsubscribe();
        this._reloadSubscription.unsubscribe();
    }

    public openCloseContingency(contingency: any) {
        this._dialogService.openDialog(CloseContingencyComponent, {
            data: contingency,
            hasBackdrop: true,
            disableClose: true,
            height: '536px',
            width: '500px'
        });
    }

    public reloadList(message) {
        if (message === 'reload') {
            this.getContingencies();
        }
    }

    /**
     * Method for get data list when is not a historical search
     */
    private getContingencies() {
        if (!this.historicalSearchService.active) {
            this.contingencyService.getContingencies().subscribe((contingencyList: Contingency[]) => {
                this.selectedContingency = contingencyList[0];
            });
        }
    }

    public getTimeAverage(creationDate: any, duration: any, remain: boolean, limit: number) {
        const actualTime = this.currentUTCTime;
        let average: number;
        const valueNumber = creationDate - actualTime;
        let warning = false;

        if (valueNumber > 0) {
            if (valueNumber <= limit) {
                warning = true;
            }
            const minutesConsumed = duration - ((valueNumber / 1000) / 60);

            average = Math.round((minutesConsumed * 100) / duration);
        } else {
            warning = true;
            average = 100;
        }

        return remain ? warning : average;
    }

}
