import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ApiRestService} from '../../../shared/_services/apiRest.service';
import {GroupTypes} from '../../../shared/_models/configuration/groupTypes';
import {Observable} from 'rxjs/Observable';
import {DetailsService} from '../../../details/_services/details.service';
import {SearchContingency} from '../../../shared/_models/contingency/searchContingency';
import {InfiniteScrollService} from '../../_services/infinite-scroll.service';
import {DialogService} from '../../_services/dialog.service';
import {DataService} from '../../../shared/_services/data.service';
import {MatPaginator} from '@angular/material';
import {Task} from '../../../shared/_models/task/task';
import {SearchTask} from '../../../shared/_models/task/searchTask';
import {HistoricalReportComponent} from '../historical-report/historical-report.component';

@Component({
    selector: 'lsl-deferral-list',
    templateUrl: './deferral-list.component.html',
    styleUrls: ['./deferral-list.component.scss'],
    providers: [DialogService]
})
export class DeferralListComponent implements OnInit, OnDestroy {

    @ViewChild('contPaginator') public paginator: MatPaginator;

    private static TASK_SEARCH_ENDPOINT = 'tasksSearch';
    private static TASK_SEARCH_COUNT_ENDPOINT = 'tasksSearchCount';

    private static CONTINGENCY_UPDATE_INTERVAL = 'CONTINGENCY_UPDATE_INTERVAL';
    private static DEFAULT_INTERVAL = 30;

    private _listSubscription: Subscription;
    private _reloadSubscription: Subscription;
    private _timerSubscription: Subscription;
    private _intervalRefreshSubscription: Subscription;
    private _paginatorSubscription: Subscription;
    private _totalRecordsSubscription: Subscription;

    private _list: Task[];

    private _selectedRegister: Task;
    private _selectedRegisterPivot: Task;
    private _intervalToRefresh: number;
    private _loading: boolean;
    private _error: boolean;

    constructor(
        private _messageData: DataService,
        private _apiRestService: ApiRestService,
        private _detailsService: DetailsService,
        private _infiniteScrollService: InfiniteScrollService,
        private _dialogService: DialogService
    ) {
        this.selectedRegister = Task.getInstance();
        this.selectedRegisterPivot = Task.getInstance();
        this.intervalToRefresh = DeferralListComponent.DEFAULT_INTERVAL;
    }

    ngOnInit() {
        // Test data
        // --------------------------
        const def1 = new Task();
        const def2 = new Task();
        def1.id = 1;
        def1.tail = 'tail 1';
        def2.id = 2;
        def2.tail = 'tail 2';
        const arrDef = [def1, def2];
        // --------------------------
        // End test data
        this.list = arrDef;
        // this._reloadSubscription = this._messageData.currentStringMessage.subscribe(message => this.reloadList(message));
        // this._intervalRefreshSubscription = this.getIntervalToRefresh().add(() => this.getList());
        // this._paginatorSubscription = this.getPaginationSubscription();
        this.infiniteScrollService.init();
    }

    /**
     * Event when component is destroyed. Unsubscribe general subscriptions.
     */
    public ngOnDestroy() {
        // this._reloadSubscription.unsubscribe();
        // this._intervalRefreshSubscription.unsubscribe();
        // this._paginatorSubscription.unsubscribe();
        if (this._totalRecordsSubscription) {
            this._totalRecordsSubscription.unsubscribe();
        }
        if (this._listSubscription) {
            this._listSubscription.unsubscribe();
        }
        if (this._timerSubscription) {
            this._timerSubscription.unsubscribe();
        }
    }

    /**
     * Returns a subscription for get total records count and set it in infinite scroll service
     * @return {Subscription}
     */
    public getTotalRecordsSubscription(signature: SearchTask): Subscription {
        this._loading = true;
        return this._apiRestService.search(DeferralListComponent.TASK_SEARCH_COUNT_ENDPOINT, signature)
            .subscribe(
                count => {
                    // this.infiniteScrollService.length = !isNaN(count) ? count : 0;
                    // this._loading = false;
                    return this.getListSubscription(signature);
                },
                () => this.getError()
            );
    }

    /**
     * Handler for error process on api request
     * @return {boolean}
     */
    private getError(): boolean {
        this.infiniteScrollService.length = 0;
        this._loading = false;
        return this._error = true;
    }

    private getListSubscription(signature: SearchTask): Subscription {
        this._loading = true;
        return this._apiRestService.search<Task[]>(DeferralListComponent.TASK_SEARCH_ENDPOINT, signature).subscribe(
            (list) => {
                const ctgInArray = list.filter(ctg => ctg.id === this.selectedRegisterPivot.id).length;
                if (this.selectedRegisterPivot.id !== null && ctgInArray === 1) {
                    this.selectedRegister = this.selectedRegisterPivot;
                } else {
                    this.selectedRegister = list[0];
                }
                this.subscribeTimer();
                this._loading = false;
            },
            () => this.getError()
        );
    }


    /**
     * Returns a subscription for pagination page event. Show loader and set pagination attributes in page change.
     * @return {Subscription}
     */
    public getPaginationSubscription(): Subscription {
        return this.paginator.page.subscribe((page) => {
            this.infiniteScrollService.pageSize = page.pageSize;
            this.infiniteScrollService.pageIndex = page.pageIndex;
            this.getList();
        });
    }

    /**
     * Method for get a search signature for get data
     * @return {SearchContingency}
     */
    private getSearchSignature(): SearchTask {
        return new SearchTask(
            this.infiniteScrollService.offset,
            this.infiniteScrollService.pageSize
        );
    }

    /**
     * Returns a subscription with data list.
     * @return {Subscription}
     */
    private getList(): Subscription {
        const signature = this.getSearchSignature();
        return this._listSubscription = this.getTotalRecordsSubscription(signature);
    }

    /**
     * Subscription for data list reload.
     * @return {Subscription}
     */
    private subscribeTimer(): Subscription {
        if (this._timerSubscription) {
            this._timerSubscription.unsubscribe();
        }
        return this._timerSubscription = Observable.timer(this.intervalToRefresh).first().subscribe(() => {
            this.getList();
        });
    }

    /**
     * Subscription for get the time for reload data
     * @return {Subscription}
     */
    private getIntervalToRefresh(): Subscription {
        this._loading = true;
        return this._apiRestService.getSingle('configTypes', DeferralListComponent.CONTINGENCY_UPDATE_INTERVAL).subscribe(
            rs => {
                const res = rs as GroupTypes;
                this.intervalToRefresh = Number(res.types[0].code) * 1000;
                this._loading = false;
            },
            () => this._loading = false
        );
    }

    /**
     * Method for reload list by an event
     * @param message
     */
    public reloadList(message) {
        if (message === 'reload') {
            this.getList();
            this._messageData.stringMessage(null);
        }
    }

    /**
     * Method for update selected contingency and contingency pivot
     * @param task
     */
    public setSelectedRegister(register: Task) {
        this.selectedRegister = register;
        this.selectedRegisterPivot = register;
        this.openCloseContingency(register);
    }

    /**
     * Method for open close contingency modal
     * @param contingency
     */
    private openCloseContingency(task: Task) {
        this._dialogService.openDialog(HistoricalReportComponent, {
            data: task,
            maxWidth: '100vw',
            width: '100%',
            height: '100%',
            hasBackdrop: false
        });
    }

    get list(): Task[] {
        return this._list;
    }

    set list(value: Task[]) {
        this._list = value;
    }

    get selectedRegister(): Task {
        return this._selectedRegister;
    }

    set selectedRegister(value: Task) {
        this._selectedRegister = value;
        this.selectedRegisterPivot = value;
    }

    get selectedRegisterPivot(): Task {
        return this._selectedRegisterPivot;
    }

    set selectedRegisterPivot(value: Task) {
        this._selectedRegisterPivot = value;
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

    get loading(): boolean {
        return this._loading;
    }

    get error(): boolean {
        return this._error;
    }

}
