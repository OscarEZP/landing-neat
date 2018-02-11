import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { HistoricalSearchService } from '../_services/historical-search.service';
import { ContingencyService } from '../_services/contingency.service';
import { Contingency } from '../../../shared/_models/contingency/contingency';
import { Aircraft } from '../../../shared/_models/aircraft';
import { TimeInstant } from '../../../shared/_models/timeInstant';
import { Flight } from '../../../shared/_models/flight';
import { Backup } from '../../../shared/_models/backup';
import { Safety } from '../../../shared/_models/safety';
import { Interval } from '../../../shared/_models/interval';
import { Status } from '../../../shared/_models/status';
import { ApiRestService } from '../../../shared/_services/apiRest.service';
import { GroupTypes } from '../../../shared/_models/configuration/groupTypes';
import { Observable } from 'rxjs/Observable';
import { DetailsService } from '../../../details/_services/details.service';
import { SearchContingency } from '../../../shared/_models/contingency/searchContingency';
import { InfiniteScrollService } from '../_services/infinite-scroll.service';
import { CloseContingencyComponent } from '../close-contingency/close-contingency.component';
import { MeetingComponent } from '../meeting/meeting.component';
import { DialogService } from '../../_services/dialog.service';
import { DataService } from '../../../shared/_services/data.service';

@Component({
    selector: 'lsl-pending-list',
    templateUrl: './pending-list.component.html',
    styleUrls: ['./pending-list.component.scss'],
    providers: [DialogService]
})
export class PendingListComponent implements OnInit, OnDestroy {

    private static CONTINGENCY_UPDATE_INTERVAL = 'CONTINGENCY_UPDATE_INTERVAL';
    private static DEFAULT_INTERVAL = 30;

    private _routingSubscription: Subscription;
    private _contingenciesSubscription: Subscription;
    private _reloadSubscription: Subscription;
    private _timerSubscription: Subscription;
    private _intervalRefreshSubscription: Subscription;
    private _selectedContingency: Contingency;
    private _selectedContingencyPivot: Contingency;
    private _intervalToRefresh: number;

    constructor(
        private _messageData: DataService,
        private _route: ActivatedRoute,
        private _historicalSearchService: HistoricalSearchService,
        private _contingencyService: ContingencyService,
        private _apiRestService: ApiRestService,
        private _detailsService: DetailsService,
        private _infiniteScrollService: InfiniteScrollService,
        private _dialogService: DialogService
    ) {
        this.contingencyService.loading = true;
        this.selectedContingency = new Contingency(null, new Aircraft(null, null, null), null, new TimeInstant(null, null), null, new Flight(null, null, null, new TimeInstant(null, null)), null, false, false, new Backup(null, new TimeInstant(null, null)), null, new Safety(null, null), new Status(null, null, null, new TimeInstant(null, null), null, new Interval(null, null), new Interval(null, null), null), null, null, 0,false);
        this.selectedContingencyPivot = new Contingency(null, new Aircraft(null, null, null), null, new TimeInstant(null, null), null, new Flight(null, null, null, new TimeInstant(null, null)), null, false, false, new Backup(null, new TimeInstant(null, null)), null, new Safety(null, null), new Status(null, null, null, new TimeInstant(null, null), null, new Interval(null, null), new Interval(null, null), null), null, null, 0,false);
        this.intervalToRefresh = 0;
    }

    ngOnInit() {
        this._reloadSubscription = this._messageData.currentStringMessage.subscribe(message => this.reloadList(message));
        this._routingSubscription = this._route.data.subscribe((data: any) => {
            this.historicalSearchService.active = data.historical;
        });
        this.contingencyService.clearList();
        this._intervalRefreshSubscription = this.getIntervalToRefresh().add(() => this.getContingencies());
    }

    /**
     * Event when component is destroyed
     */
    public ngOnDestroy() {
        this._reloadSubscription.unsubscribe();
        this._routingSubscription.unsubscribe();
        this._intervalRefreshSubscription.unsubscribe();
        if (this._contingenciesSubscription) {
            this._contingenciesSubscription.unsubscribe();
        }
        if (this._timerSubscription) {
            this._timerSubscription.unsubscribe();
        }
    }

    private getContingencies() {
        if (!this.historicalSearchService.active) {
            this.contingencyService.loading = true;
            const searchSignature = new SearchContingency(null, null, null, new TimeInstant(0, ''), new TimeInstant(0, ''), false, true);
            this._contingenciesSubscription = this.contingencyService.getPendings(searchSignature).subscribe((contingencyList: Contingency[]) => {
                const ctgInArray = contingencyList.filter(ctg => ctg.id === this.selectedContingencyPivot.id).length;
                if (this.selectedContingencyPivot.id !== null && ctgInArray === 1) {
                    this.selectedContingency = this.selectedContingencyPivot;
                } else {
                    this.selectedContingency = contingencyList[0];
                }
                this.subscribeTimer();
                this.contingencyService.loading = false;
            });
        }
    }

    private subscribeTimer(): Subscription {
        if (this._timerSubscription) {
            this._timerSubscription.unsubscribe();
        }
        return this._timerSubscription = Observable.timer(this.intervalToRefresh).first().subscribe(() => {
            this.getContingencies();
        });
    }

    private getIntervalToRefresh(): Subscription {
        this.contingencyService.loading = true;
        return this._apiRestService.getSingle('configTypes', PendingListComponent.CONTINGENCY_UPDATE_INTERVAL).subscribe(rs => {
            const res = rs as GroupTypes;
            this.intervalToRefresh = Number(res.types[0].code) * 1000;
            this.contingencyService.loading = false;
        }, error => this.intervalToRefresh = PendingListComponent.DEFAULT_INTERVAL * 1000);
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

    get infiniteScrollService(): InfiniteScrollService {
        return this._infiniteScrollService;
    }

    set infiniteScrollService(value: InfiniteScrollService) {
        this._infiniteScrollService = value;
    }
}
