import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {HistoricalSearchService} from '../../_services/historical-search.service';
import {ContingencyService} from '../../_services/contingency.service';
import {Contingency} from '../../../shared/_models/contingency/contingency';
import {TimeInstant} from '../../../shared/_models/timeInstant';
import {ApiRestService} from '../../../shared/_services/apiRest.service';
import {GroupTypes} from '../../../shared/_models/configuration/groupTypes';
import {Observable} from 'rxjs/Observable';
import {DetailsService} from '../../../details/_services/details.service';
import {SearchContingency} from '../../../shared/_models/contingency/searchContingency';
import {PaginatorObjectService} from '../../_services/paginator-object.service';
import {CloseContingencyComponent} from '../close-contingency/close-contingency.component';
import {MeetingComponent} from '../meeting/meeting.component';
import {DialogService} from '../../_services/dialog.service';
import {DataService} from '../../../shared/_services/data.service';
import {MatPaginator} from '@angular/material';
import {ResolvePendingComponent} from '../resolve-pending/resolve-pending.component';
import {Layout, LayoutService} from '../../../layout/_services/layout.service';
import {ContingencyFormComponent} from '../create-contingency/create-contingency.component';
@Component({
    selector: 'lsl-pending-list',
    templateUrl: './pending-list.component.html',
    styleUrls: ['./pending-list.component.scss'],
    providers: [DialogService]
})
export class PendingListComponent implements OnInit, OnDestroy {

    @ViewChild('contPaginator') public paginator: MatPaginator;

    private static CONTINGENCY_UPDATE_INTERVAL = 'CONTINGENCY_UPDATE_INTERVAL';
    private static DEFAULT_INTERVAL = 30;

    private _contingenciesSubscription: Subscription;
    private _reloadSubscription: Subscription;
    private _timerSubscription: Subscription;
    private _intervalRefreshSubscription: Subscription;
    private _paginatorSubscription: Subscription;
    private _totalRecordsSubscription: Subscription;
    private _selectedContingency: Contingency;
    private _selectedContingencyPivot: Contingency;
    private _intervalToRefresh: number;
    private _paginatorObjectService: PaginatorObjectService;

    constructor(
        private _messageData: DataService,
        private _historicalSearchService: HistoricalSearchService,
        private _contingencyService: ContingencyService,
        private _apiRestService: ApiRestService,
        private _detailsService: DetailsService,
        private _dialogService: DialogService,
        private _layoutService: LayoutService
    ) {
        this.layout = {
            disableAddButton: false,
            disableRightNav: true,
            showRightNav: true,
            showAddButton: true,
            loading: false,
            formComponent: ContingencyFormComponent,
            toDoList: 'Contingency'
        };
    }

    ngOnInit() {
        this.contingencyService.loading = true;
        this.intervalToRefresh = 0;
        this.selectedContingency = Contingency.getInstance();
        this.selectedContingencyPivot = Contingency.getInstance();
        this.paginatorObjectService = PaginatorObjectService.getInstance();
        this._reloadSubscription = this._messageData.currentStringMessage.subscribe(message => this.reloadList(message));
        this.contingencyService.clearList();
        this._intervalRefreshSubscription = this.getIntervalToRefresh().add(() => this.getContingencies());
        this._paginatorSubscription = this.getPaginationSubscription();
        this._totalRecordsSubscription = this.getTotalRecordsSubscription();
    }

    /**
     * Event when component is destroyed. Unsubscribe general subscriptions.
     */
    public ngOnDestroy() {
        this._reloadSubscription.unsubscribe();
        this._intervalRefreshSubscription.unsubscribe();
        this._paginatorSubscription.unsubscribe();
        this._totalRecordsSubscription.unsubscribe();
        if (this._contingenciesSubscription) {
            this._contingenciesSubscription.unsubscribe();
        }
        if (this._timerSubscription) {
            this._timerSubscription.unsubscribe();
        }
    }

    /**
     * Returns a subscription for get total records count and set it in infinite scroll service
     * @return {Subscription}
     */
    public getTotalRecordsSubscription(): Subscription {
        const searchSignature = this.getSearchSignature();
        return this.contingencyService.getTotalRecords(searchSignature).subscribe((count) => {
            this.paginatorObjectService.length = count.items;
        });
    }

    /**
     * Returns a subscription for pagination page event. Show loader and set pagination attributes in page change.
     * @return {any}
     */
    public getPaginationSubscription(): Subscription {
        return this.paginator.page.subscribe((page) => {
            this.paginatorObjectService.pageSize = page.pageSize;
            this.paginatorObjectService.pageIndex = page.pageIndex;
            this.contingencyService.loading = true;
            this.getContingencies();
        });
    }

    /**
     * Method for get a search signature
     * @return {SearchContingency}
     */
    private getSearchSignature(): SearchContingency {
        return new SearchContingency(
            this.paginatorObjectService.offset,
            this.paginatorObjectService.pageSize,
            null,
           TimeInstant.getInstance(),
           TimeInstant.getInstance(),
            false,
            true
        );
    }

    /**
     * Returns a subscription with pendings list.
     * @return {Subscription}
     */
    private getContingencies(): Subscription {
        this.contingencyService.loading = true;
        const searchSignature = this.getSearchSignature();
        return this._contingenciesSubscription = this.contingencyService.getPendings(searchSignature).subscribe((contingencyList: Contingency[]) => {
            const ctgInArray = contingencyList.filter(ctg => ctg.id === this.selectedContingencyPivot.id).length;
            if (this.selectedContingencyPivot.id !== null && ctgInArray === 1) {
                this.selectedContingency = this.selectedContingencyPivot;
            } else {
                this.selectedContingency = contingencyList[0];
            }
            this.subscribeTimer();
            this.contingencyService.loading = false;
            this._layoutService.disableRightNav = this._contingencyService.contingencyList.length === 0;
        });
    }

    /**
     * Subscription for pending list reload.
     * @return {Subscription}
     */
    private subscribeTimer(): Subscription {
        if (this._timerSubscription) {
            this._timerSubscription.unsubscribe();
        }
        return this._timerSubscription = Observable.timer(this.intervalToRefresh).first().subscribe(() => {
            this.getContingencies();
        });
    }

    /**
     * Subscription for get the time for reloa data
     * @return {Subscription}
     */
    private getIntervalToRefresh(): Subscription {
        this.contingencyService.loading = true;
        return this._apiRestService.getSingle('configTypes', PendingListComponent.CONTINGENCY_UPDATE_INTERVAL).subscribe(rs => {
            const res = rs as GroupTypes;
            this.intervalToRefresh = Number(res.types[0].code) * 1000;
            this.contingencyService.loading = false;
        }, error => this.intervalToRefresh = PendingListComponent.DEFAULT_INTERVAL * 1000);
    }

    /**
     * Method for open close contingency modal
     * @param contingency
     */
    public openCloseContingency(contingency: any) {
        this._dialogService.openDialog(CloseContingencyComponent, {
            data: contingency,
            hasBackdrop: true,
            disableClose: true,
            height: '536px',
            width: '500px'
        });
    }

    /**
     * Method for open meeting creation modal
     * @param contingency
     */
    public openMeeting(contingency: Contingency) {
        this._dialogService.openDialog(MeetingComponent, {
            data: contingency,
            maxWidth: '100vw',
            width: '100%',
            height: '100%',
            hasBackdrop: false
        });
    }

    /**
     * Method for open meeting creation modal
     * @param contingency
     */
    public openPending(contingency: Contingency) {
        this._dialogService.openDialog(ResolvePendingComponent, {
            data: contingency,
            width: '500px',
            height: '60%',
            hasBackdrop: true
        });
    }


    /**
     * Method for reload list by an event
     * @param message
     */
    public reloadList(message) {
        if (message === 'reload') {
            this.getContingencies();
            this._messageData.stringMessage(null);
        }
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

    /**
     * Method for check list status with two variables, data loaded and loading process,
     * if there is not data and the list is not loading, return false
     * @return {boolean}
     */
    public checkDataStatus(): boolean {
        return this.contingencyService.contingencyList.length > 0 && !this.contingencyService.loading;
    }

    set layout(value: Layout) {
        this._layoutService.layout = value;
    }

    get historicalSearchService(): HistoricalSearchService {
        return this._historicalSearchService;
    }

    set historicalSearchService(value: HistoricalSearchService) {
        this._historicalSearchService = value;
    }

    get contingencyService(): ContingencyService {
        return this._contingencyService;
    }

    set contingencyService(value: ContingencyService) {
        this._contingencyService = value;
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

    get detailsService(): DetailsService {
        return this._detailsService;
    }

    get paginatorObjectService(): PaginatorObjectService {
        return this._paginatorObjectService;
    }

    set paginatorObjectService(value: PaginatorObjectService) {
        this._paginatorObjectService = value;
    }
}
