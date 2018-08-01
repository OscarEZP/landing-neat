import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Aog} from '../../../shared/_models/aog/aog';
import {TranslateService} from '@ngx-translate/core';
import {Layout, LayoutService} from '../../../layout/_services/layout.service';
import {ApiRestService} from '../../../shared/_services/apiRest.service';
import {Subscription} from 'rxjs/Subscription';
import {PaginatorObjectService} from '../../_services/paginator-object.service';
import {MatPaginator} from '@angular/material';
import {Pagination} from '../../../shared/_models/common/pagination';
import {AogSearch} from '../../../shared/_models/aog/aogSearch';
import {GroupTypes} from '../../../shared/_models/configuration/groupTypes';
import {DataService} from '../../../shared/_services/data.service';
import {Observable} from 'rxjs/Observable';
import {AogFormComponent} from '../aog-form/aog-form.component';
import {Count} from '../../../shared/_models/common/count';
import {tap} from 'rxjs/operators';
import {AogService} from '../../_services/aog.service';

@Component({
    selector: 'lsl-aog-list',
    templateUrl: './aog-list.component.html',
    styleUrls: ['./aog-list.component.scss']
})
export class AogListComponent implements OnInit, OnDestroy {

    @ViewChild('contPaginator') public paginator: MatPaginator;

    private static CONTINGENCY_UPDATE_INTERVAL = 'CONTINGENCY_UPDATE_INTERVAL';
    private static DEFAULT_INTERVAL = 30;

    private _aogList: Aog[];
    private _error: boolean;
    private _loading: boolean;
    private _paginatorObject: PaginatorObjectService;
    private _paginatorSubscription: Subscription;
    private _listSubscription: Subscription;
    private _intervalRefreshSubscription: Subscription;
    private _reloadSubscription: Subscription;
    private _timerSubscription: Subscription;
    private _intervalToRefresh: number;
    private _countSub: Subscription;

    constructor(private _messageData: DataService,
                private _translate: TranslateService,
                private _apiRestService: ApiRestService,
                private _layoutService: LayoutService,
                private _aogService: AogService) {


        this._translate.setDefaultLang('en');
        this._error = false;
        this._aogList = [];
        this.layout = {
            disableAddButton: false,
            disableRightNav: true,
            showRightNav: true,
            showAddButton: true,
            loading: false,
            formComponent: AogFormComponent
        };
    }

    ngOnInit() {
        this.intervalToRefresh = AogListComponent.DEFAULT_INTERVAL;
        this.paginatorObjectService = PaginatorObjectService.getInstance();
        this.reloadSubscription = this._messageData.currentStringMessage.subscribe(message => this.reloadList(message));
        this.intervalRefreshSubscription = this.getIntervalToRefresh();
        this.paginatorSubscription = this.getPaginationSubscription();
    }

    /**
     * Event when component is destroyed. Unsubscribe general subscriptions.
     */
    public ngOnDestroy() {
        this.reloadSubscription.unsubscribe();
        this.intervalRefreshSubscription.unsubscribe();
        this.paginatorSubscription.unsubscribe();
        this.countSub.unsubscribe();
        if (this.listSubscription) {
            this.listSubscription.unsubscribe();
        }
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
    }

    /**
     * Returns a subscription for pagination page event. Show loader and set pagination attributes in page change.
     * @return {Subscription}
     */
    public getPaginationSubscription(): Subscription {
        return this.paginator.page.subscribe((page) => {
            this.paginatorObjectService.pageSize = page.pageSize;
            this.paginatorObjectService.pageIndex = page.pageIndex;
            this.getList();
        });
    }

    /**
     * Method for get a search signature for get data
     * @return {AogSearch}
     */
    private getSearchSignature(): AogSearch {
        const signature: AogSearch = AogSearch.getInstance();
        signature.pagination = new Pagination(this.paginatorObjectService.offset, this.paginatorObjectService.pageSize);
        signature.isClose = false;
        return signature;
    }

    /**
     * Set a subscription for total amount of records and data list.
     */
    private getList(): void {
        const signature = this.getSearchSignature();
        this.countSub = this.getCount$(signature).subscribe(
            () => this.listSubscription = this.getListSubscription(signature),
            () => this.getError()
        );
    }

    /**
     * Subscription for get the data list
     * @param signature
     * @return {Subscription}
     */
    private getListSubscription(signature: AogSearch): Subscription {
        this.loading = true;
        this.error = false;
        return this._aogService.search(signature).subscribe(
            (response) => {
                this.subscribeTimer();
                this.aogList = response;
                this.loading = false;
            },
            () => {
                this.getError();
                this.subscribeTimer();
            });
    }

    /**
     * Set a subscription for data list reload.
     */
    private subscribeTimer(): void {
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
        this.timerSubscription = Observable.timer(this.intervalToRefresh).first().subscribe(() => {
            this.getList();
        });
    }

    private getCount$(search: AogSearch): Observable<Count> {
        return this._aogService
            .getTotalRecords(search)
            .pipe(
                tap(response => this.paginatorObjectService.length = response.items)
            );
    }

    /**
     * Subscription for get the time for reload data
     * @return {Subscription}
     */
    private getIntervalToRefresh(): Subscription {
        this.loading = true;
        this.error = false;
        return this._apiRestService.getSingle('configTypes', AogListComponent.CONTINGENCY_UPDATE_INTERVAL)
            .subscribe(
                rs => {
                    const res = rs as GroupTypes;
                    this.intervalToRefresh = Number(res.types[0].code ? res.types[0].code : AogListComponent.DEFAULT_INTERVAL) * 1000;
                    this.loading = false;
                    this.getList();
                },
                () => {
                    this.loading = false;
                    this.intervalToRefresh = AogListComponent.DEFAULT_INTERVAL * 1000;
                    this.getList();
                }
            );
    }

    /**
     * Handler for error process on api request
     * @return {boolean}
     */
    private getError(): boolean {
        this.paginatorObjectService.length = 0;
        this.loading = false;
        return this.error = true;
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

    get aogList(): Aog[] {
        return this._aogList;
    }

    set aogList(value: Aog[]) {
        this._aogList = value;
    }

    get error(): boolean {
        return this._error;
    }

    set error(value: boolean) {
        this._error = value;
    }

    get paginatorObjectService(): PaginatorObjectService {
        return this._paginatorObject;
    }

    set paginatorObjectService(value: PaginatorObjectService) {
        this._paginatorObject = value;
    }

    get paginatorSubscription(): Subscription {
        return this._paginatorSubscription;
    }

    set paginatorSubscription(value: Subscription) {
        this._paginatorSubscription = value;
    }

    get listSubscription(): Subscription {
        return this._listSubscription;
    }

    set listSubscription(value: Subscription) {
        this._listSubscription = value;
    }

    get loading(): boolean {
        return this._loading;
    }

    set loading(value: boolean) {
        this._loading = value;
    }

    get intervalRefreshSubscription(): Subscription {
        return this._intervalRefreshSubscription;
    }

    set intervalRefreshSubscription(value: Subscription) {
        this._intervalRefreshSubscription = value;
    }

    get intervalToRefresh(): number {
        return this._intervalToRefresh;
    }

    set intervalToRefresh(value: number) {
        this._intervalToRefresh = value;
    }

    get reloadSubscription(): Subscription {
        return this._reloadSubscription;
    }

    set reloadSubscription(value: Subscription) {
        this._reloadSubscription = value;
    }

    get paginatorObject(): PaginatorObjectService {
        return this._paginatorObject;
    }

    set paginatorObject(value: PaginatorObjectService) {
        this._paginatorObject = value;
    }

    get timerSubscription(): Subscription {
        return this._timerSubscription;
    }

    set timerSubscription(value: Subscription) {
        this._timerSubscription = value;
    }

    set layout(value: Layout) {
        this._layoutService.layout = value;
    }

    get countSub(): Subscription {
        return this._countSub;
    }

    set countSub(value: Subscription) {
        this._countSub = value;
    }
}
