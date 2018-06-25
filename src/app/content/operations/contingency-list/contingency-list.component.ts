import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs/Subscription';
import {DetailsService} from '../../../details/_services/details.service';
import {Contingency} from '../../../shared/_models/contingency/contingency';
import {TimeInstant} from '../../../shared/_models/timeInstant';
import {DataService} from '../../../shared/_services/data.service';
import {DialogService} from '../../_services/dialog.service';
import {CloseContingencyComponent} from '../close-contingency/close-contingency.component';
import {ActivatedRoute} from '@angular/router';
import {HistoricalSearchService} from '../../_services/historical-search.service';
import {ContingencyService} from '../../_services/contingency.service';
import {MatPaginator} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/first';
import {ApiRestService} from '../../../shared/_services/apiRest.service';
import {GroupTypes} from '../../../shared/_models/configuration/groupTypes';
import {MeetingComponent} from '../meeting/meeting.component';
import {SearchContingency} from '../../../shared/_models/contingency/searchContingency';
import {PaginatorObjectService} from '../../_services/paginator-object.service';
import {LayoutService} from '../../../layout/_services/layout.service';


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
    private _contingenciesSubscription: Subscription;
    private _historicalSubscription: Subscription;
    private _timerSubscription: Subscription;
    private _routingSubscription: Subscription;
    private _intervalRefreshSubscription: Subscription;
    private _currentUTCTime: number;
    private _selectedContingency: Contingency;
    private _selectedContingencyPivot: Contingency;
    private _intervalToRefresh: number;
    private _paginatorObject: PaginatorObjectService;

    constructor(private _messageData: DataService,
                private _dialogService: DialogService,
                private _route: ActivatedRoute,
                private _detailsService: DetailsService,
                private _historicalSearchService: HistoricalSearchService,
                private _contingencyService: ContingencyService,
                private _translate: TranslateService,
                private _apiRestService: ApiRestService,
                private _layoutService: LayoutService
    ) {
        this._translate.setDefaultLang('en');
        this.selectedContingency = Contingency.getInstance();
        this.selectedContingencyPivot = Contingency.getInstance();
        this._intervalToRefresh = 0;
    }

    ngOnInit() {
        this.currentUTCTime = 0;
        this.messageSubscriptions = this._messageData.currentNumberMessage.subscribe(message => this.currentUTCTime = message);
        this.reloadSubscription = this._messageData.currentStringMessage.subscribe(message => this.reloadList(message));
        this.routingSubscription = this._route.data.subscribe(data => this.historicalSearchService.active = data.historical);
        this.contingencyService.clearList();
        this.paginatorObject = PaginatorObjectService.getInstance();
        this.getPaginationSubscription();
        this.intervalRefreshSubscription = this.getIntervalToRefresh().add(() => this.getContingencies());
        this._layoutService.disableAddButton = false;
    }

    /**
     * Event when component is destroyed the conditionals is because if they're not present the test fails to unsubscribe when there's not subscription before
     */
    public ngOnDestroy() {
        if (this.messageSubscriptions) {
            this.messageSubscriptions.unsubscribe();
        }
        if (this.reloadSubscription) {
            this.reloadSubscription.unsubscribe();
        }
        if (this.routingSubscription) {
            this.routingSubscription.unsubscribe();
        }
        if (this.intervalRefreshSubscription) {
            this.intervalRefreshSubscription.unsubscribe();
        }
        if (this.contingenciesSubscription) {
            this.contingenciesSubscription.unsubscribe();
        }
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
        if (this.historicalSubscription) {
            this.historicalSubscription.unsubscribe();
        }
    }

    private getPaginationSubscription(): Subscription {
        return this.paginator.page.subscribe((page) => {
            this.paginatorObject.pageSize = page.pageSize;
            this.paginatorObject.pageIndex = page.pageIndex;
            const search = new SearchContingency(
                this.paginatorObject.offset,
                this.paginatorObject.pageSize,
                this.historicalSearchService.tails,
                new TimeInstant(this.historicalSearchService.fromTS, ''),
                new TimeInstant(this.historicalSearchService.toTS, ''),
                true,
                false
            );
            this.contingencyService.loading = true;
            this.historicalSubscription = this.contingencyService.postHistoricalSearch(search).subscribe(() => { this.contingencyService.loading = false; });
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
        this.setSelectedContingency(contingency);
    }

    /**
     * Method for update selected contingency and contingency pivot
     * @param contingency
     */
    public setSelectedContingency(contingency: Contingency) {
        this.selectedContingency = contingency;
        this.selectedContingencyPivot = contingency;
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

    public openMeeting(contingency: Contingency) {
        this._dialogService.openDialog(MeetingComponent, {
            data: contingency,
            maxWidth: '100vw',
            width: '100%',
            height: '100%',
            hasBackdrop: false
        });
    }

    public reloadList(message) {
        if (message === 'reload') {
            this.getContingencies();
            this._messageData.stringMessage(null);
        }
    }

    /**
     * Method for get data list when is not a historical search
     */
    private getContingencies() {
        if (!this.historicalSearchService.active) {
            this.contingencyService.loading = true;
            this.contingenciesSubscription = this.contingencyService.getContingencies().subscribe((contingencyList: Contingency[]) => {
                const ctgInArray = contingencyList.filter(ctg => ctg.id === this.selectedContingencyPivot.id).length;
                if (this.selectedContingencyPivot.id !== null && ctgInArray === 1) {
                    this.selectedContingency = this.selectedContingencyPivot;
                } else {
                    this.selectedContingency = contingencyList[0];
                }
                this.subscribeTimer();
                this.contingencyService.loading = false;
                this._layoutService.disableRightNav = (this._contingencyService.contingencyList.length === 0);
            });
        }
    }

    private subscribeTimer(): Subscription {
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
        return this.timerSubscription = Observable.timer(this.intervalToRefresh).first().subscribe(() => {
            this.getContingencies();
        });
    }

    private getIntervalToRefresh(): Subscription {
        this.contingencyService.loading = true;

        return this._apiRestService.getSingle<GroupTypes>('configTypes', 'CONTINGENCY_UPDATE_INTERVAL').subscribe(
            (rs: GroupTypes) => this.intervalToRefresh = Number(rs.types[0].code) * 1000,
            () => this.intervalToRefresh = 60 * 1000,
            () => this.contingencyService.loading = false
        );
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

    get currentUTCTime(): number {
        return this._currentUTCTime;
    }

    set currentUTCTime(value: number) {
        this._currentUTCTime = value;
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

    get selectedContingencyPivot(): Contingency {
        return this._selectedContingencyPivot;
    }

    set selectedContingencyPivot(value: Contingency) {
        this._selectedContingencyPivot = value;
    }

    get intervalToRefresh(): number {
        return this._intervalToRefresh;
    }

    set intervalToRefresh(value: number) {
        this._intervalToRefresh = value;
    }

    get paginatorObject(): PaginatorObjectService {
        return this._paginatorObject;
    }

    set paginatorObject(value: PaginatorObjectService) {
        this._paginatorObject = value;
    }

    get intervalRefreshSubscription(): Subscription {
        return this._intervalRefreshSubscription;
    }

    set intervalRefreshSubscription(value: Subscription) {
        this._intervalRefreshSubscription = value;
    }

    get messageSubscriptions(): Subscription {
        return this._messageSubscriptions;
    }

    set messageSubscriptions(value: Subscription) {
        this._messageSubscriptions = value;
    }

    get reloadSubscription(): Subscription {
        return this._reloadSubscription;
    }

    set reloadSubscription(value: Subscription) {
        this._reloadSubscription = value;
    }

    get routingSubscription(): Subscription {
        return this._routingSubscription;
    }

    set routingSubscription(value: Subscription) {
        this._routingSubscription = value;
    }

    get contingenciesSubscription(): Subscription {
        return this._contingenciesSubscription;
    }

    set contingenciesSubscription(value: Subscription) {
        this._contingenciesSubscription = value;
    }

    get historicalSubscription(): Subscription {
        return this._historicalSubscription;
    }

    set historicalSubscription(value: Subscription) {
        this._historicalSubscription = value;
    }

    get timerSubscription(): Subscription {
        return this._timerSubscription;
    }

    set timerSubscription(value: Subscription) {
        this._timerSubscription = value;
    }
}
