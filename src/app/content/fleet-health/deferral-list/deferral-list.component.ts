import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {ApiRestService} from '../../../shared/_services/apiRest.service';
import {GroupTypes} from '../../../shared/_models/configuration/groupTypes';
import {Observable} from 'rxjs/Observable';
import {DetailsService} from '../../../details/_services/details.service';
import {PaginatorObjectService} from '../../_services/paginator-object.service';
import {DialogService} from '../../_services/dialog.service';
import {DataService} from '../../../shared/_services/data.service';
import {MatPaginator} from '@angular/material';
import {Task} from '../../../shared/_models/task/task';
import {FleetHealthSearch} from '../../../shared/_models/task/search/fleetHealthSearch';
import {Pagination} from '../../../shared/_models/common/pagination';
import {HistoricalReportComponent} from '../historical-report/historical-report.component';
import {HistoricalReportService} from '../historical-report/_services/historical-report.service';
import {StorageService} from '../../../shared/_services/storage.service';
import {MessageService} from '../../../shared/_services/message.service';
import {FleetHealthResponse} from '../../../shared/_models/task/fleethealth/technical/fleetHealthResponse';
import {ManagementUser} from '../../../shared/_models/management/managementUser';
import {TechnicalAnalysis} from '../../../shared/_models/task/fleethealth/technical/technicalAnalysis';
import {isArray} from 'util';

@Component({
    selector: 'lsl-deferral-list',
    templateUrl: './deferral-list.component.html',
    styleUrls: ['./deferral-list.component.scss'],
    providers: [DialogService]
})
export class DeferralListComponent implements OnInit, OnDestroy {

    @ViewChild('contPaginator') public paginator: MatPaginator;

    private static TASK_FLEETHEALTH_ENDPOINT = 'tasksFleethealthSearch';

    private static DEFERRAL_UPDATE_INTERVAL = 'DEFERRAL_UPDATE_INTERVAL';
    private static DEFAULT_INTERVAL = 120;

    private _listSubscription: Subscription;
    private _reloadSubscription: Subscription;
    private _timerSubscription: Subscription;
    private _intervalRefreshSubscription: Subscription;
    private _paginatorSubscription: Subscription;

    private _list: Task[];

    private _selectedRegister: Task;
    private _selectedRegisterPivot: Task;
    private _intervalToRefresh: number;
    private _loading: boolean;
    private _error: boolean;
    private _haveStationsConf: boolean;
    private _haveAuthoritiesConf: boolean;
    private _paginatorObject: PaginatorObjectService;

    constructor(
        private _messageData: DataService,
        private _apiRestService: ApiRestService,
        private _detailsService: DetailsService,
        private _dialogService: DialogService,
        private _historicalReportService: HistoricalReportService,
        private _localStorage: StorageService,
        private _messageService: MessageService,
        private _dataService: DataService,
    ) {}

    ngOnInit() {
        this.intervalToRefresh = DeferralListComponent.DEFAULT_INTERVAL;
        this.selectedRegister = Task.getInstance();
        this.selectedRegisterPivot = Task.getInstance();
        this.paginatorObjectService = PaginatorObjectService.getInstance();
        this.list = [];
        this.reloadSubscription = this._messageData.currentStringMessage.subscribe(message => this.reloadList(message));
        this.intervalRefreshSubscription = this.getIntervalToRefresh();
        this.paginatorSubscription = this.getPaginationSubscription();
        this.haveStationsConf = this.validateStations();
        this.haveAuthoritiesConf = this.validateAuthorities();
    }

    /**
     * Event when component is destroyed. Unsubscribe general subscriptions.
     */
    public ngOnDestroy() {
        this.reloadSubscription.unsubscribe();
        this.intervalRefreshSubscription.unsubscribe();
        this.paginatorSubscription.unsubscribe();
        if (this.listSubscription) {
            this.listSubscription.unsubscribe();
        }
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
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
     * Validate stations configuration
     * @return {boolean}
     */
    private validateStations(): boolean {
        const currentUser: ManagementUser = this._localStorage.userManagement;

        return !(currentUser === null || currentUser.detailStation === null || currentUser.detailStation.defaults === null || currentUser.detailStation.defaults.code === null || currentUser.detailStation.defaults.code === '');

    }

    /**
     * Validate authorities configuration
     * @return {boolean}
     */
    private validateAuthorities(): boolean {

        const technicalAnalisys: TechnicalAnalysis[] = this._localStorage.userAtecFilter;
        return isArray(technicalAnalisys) && technicalAnalisys.length > 0;
    }

    /**
     * Subscription for get the data list
     * @param signature
     * @return {Subscription}
     */
    private getListSubscription(signature: FleetHealthSearch): Subscription {
        this.loading = true;
        this.error = false;

        this.haveAuthoritiesConf = this.validateAuthorities();
        if (this.haveAuthoritiesConf) {
        return this._apiRestService.search<FleetHealthResponse>(DeferralListComponent.TASK_FLEETHEALTH_ENDPOINT, signature).subscribe(
            (response) => {
                const ctgInArray = response.fleetHealths.filter(ctg => ctg.id === this.selectedRegisterPivot.id).length;
                if (this.selectedRegisterPivot.id !== null && ctgInArray === 1) {
                    this.selectedRegister = this.selectedRegisterPivot;
                } else {
                    this.selectedRegister = response.fleetHealths[0];
                }
                this.subscribeTimer();
                this.list = response.fleetHealths;
                this.loading = false;
                this.paginatorObjectService.length = !isNaN(response.count.items) ? response.count.items : 0;

            },
            () => {
                this.getError();
                this.subscribeTimer();
            });
        } else {
            this.loading = false;
            return new Subscription();
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
     * @return {SearchTask}
     */
    private getSearchSignature(): FleetHealthSearch {
        const signature: FleetHealthSearch = FleetHealthSearch.getInstance();
        signature.technicalAnalysis = this._localStorage.userAtecFilter;
        signature.pagination = new Pagination(this.paginatorObjectService.offset, this.paginatorObjectService.pageSize);
       return signature;
    }

    /**
     * Set a subscription for get total amount of records and data list.
     */
    private getList(): void {
        const signature = this.getSearchSignature();
        this.listSubscription = this.getListSubscription(signature);
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

    /**
     * Subscription for get the time for reload data
     * @return {Subscription}
     */
    private getIntervalToRefresh(): Subscription {
        this.loading = true;
        this.error = false;
        return this._apiRestService.getSingle('configTypes', DeferralListComponent.DEFERRAL_UPDATE_INTERVAL).subscribe(
            rs => {
                const res = rs as GroupTypes;
                this.intervalToRefresh = Number(res.types[0].code ? res.types[0].code : DeferralListComponent.DEFAULT_INTERVAL) * 1000;
                this.loading = false;
            },
            () => {
                this.loading = false;
                this.intervalToRefresh = DeferralListComponent.DEFAULT_INTERVAL * 1000;
                this.getList();
            }, () => {
                this.getList();
            }
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
            this.openHistoricalReport(register);
            this.serviceTask = register;
            this.list = [];
            this.listSubscription.unsubscribe();
    }

    /**
     * Method for open Historical Task
     * @param task
     */
    private openHistoricalReport(task: Task) {
        this._dialogService.openDialog(HistoricalReportComponent, {
            maxWidth: '100vw',
            width: '100%',
            height: '100%',
            hasBackdrop: false,
            disableClose: true
        });
    }

    /**
     * Method that allow manually mark any task as done
     * @param {string} barcode
     * @returns {Subscription}
     */
    public markAsDone(barcode: string): Subscription {
        this.loading = true;
        const localStorage = this._localStorage.getCurrentUser();
        const user = {
            'username' : localStorage.username,
            'firstName' : localStorage.firstName,
            'lastName' : localStorage.lastName
        };
        return this._apiRestService
            .add('tasksFleethealthDone', user, barcode)
            .subscribe(() => {
                this.loading = false;
                this._dataService.stringMessage('reload');
            }, error => {
                this._messageService.openSnackBar(error.message);
                this._dataService.stringMessage('reload');
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

    get paginatorObjectService(): PaginatorObjectService {
        return this._paginatorObject;
    }

    set paginatorObjectService(value: PaginatorObjectService) {
        this._paginatorObject = value;
    }

    set loading(value: boolean) {
        this._loading = value;
    }

    get loading(): boolean {
        return this._loading;
    }

    set error(value: boolean) {
        this._error = value;
    }

    get error(): boolean {
        return this._error;
    }

    set serviceTask(value: Task) {
        this._historicalReportService.task = value;
    }

    get listSubscription(): Subscription {
        return this._listSubscription;
    }

    set listSubscription(value: Subscription) {
        this._listSubscription = value;
    }

    get reloadSubscription(): Subscription {
        return this._reloadSubscription;
    }

    set reloadSubscription(value: Subscription) {
        this._reloadSubscription = value;
    }

    get timerSubscription(): Subscription {
        return this._timerSubscription;
    }

    set timerSubscription(value: Subscription) {
        this._timerSubscription = value;
    }

    get intervalRefreshSubscription(): Subscription {
        return this._intervalRefreshSubscription;
    }

    set intervalRefreshSubscription(value: Subscription) {
        this._intervalRefreshSubscription = value;
    }

    get paginatorSubscription(): Subscription {
        return this._paginatorSubscription;
    }

    set paginatorSubscription(value: Subscription) {
        this._paginatorSubscription = value;
    }

    get haveStationsConf(): boolean {
        return this._haveStationsConf;
    }

    set haveStationsConf(value: boolean) {
        this._haveStationsConf = value;
    }

    get haveAuthoritiesConf(): boolean {
        return this._haveAuthoritiesConf;
    }

    set haveAuthoritiesConf(value: boolean) {
        this._haveAuthoritiesConf = value;
    }
}
