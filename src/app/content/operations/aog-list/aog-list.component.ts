import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Aog} from '../../../shared/_models/aog/aog';
import {Layout, LayoutService} from '../../../layout/_services/layout.service';
import {ApiRestService} from '../../../shared/_services/apiRest.service';
import {Subscription} from 'rxjs/Subscription';
import {PaginatorObjectService} from '../../_services/paginator-object.service';
import {MatDialog, MatPaginator} from '@angular/material';
import {Pagination} from '../../../shared/_models/common/pagination';
import {AogSearch} from '../../../shared/_models/aog/aogSearch';
import {GroupTypes} from '../../../shared/_models/configuration/groupTypes';
import {DataService} from '../../../shared/_services/data.service';
import {Observable} from 'rxjs/Observable';
import {AogFormComponent} from '../aog-form/aog-form.component';
import {Count} from '../../../shared/_models/common/count';
import {RecoveryPlanComponent} from './recovery-plan/recovery-plan.component';
import {tap} from 'rxjs/operators';
import {AogService} from '../../_services/aog.service';
import {DialogService} from '../../_services/dialog.service';
import {CloseAogComponent} from '../close-aog/close-aog.component';
import {TranslationService} from '../../../shared/_services/translation.service';
import {
    EditFieldComponent, EditFieldDataInterface,
    EditFieldTranslationInterface
} from '../edit-field/edit-field.component';
import {Reason} from '../../../shared/_models/common/reason';
import {Audit} from '../../../shared/_models/common/audit';
import {StorageService} from '../../../shared/_services/storage.service';

@Component({
    selector: 'lsl-aog-list',
    templateUrl: './aog-list.component.html',
    styleUrls: ['./aog-list.component.scss']
})
export class AogListComponent implements OnInit, OnDestroy {

    @ViewChild('contPaginator') public paginator: MatPaginator;

    private static EDIT_REASON_AOG_ENDPOINT = 'editReasonAircraftOnGround';
    private static DEFAULT_ERROR_MESSAGE = 'ERRORS.DEFAULT';
    private static SUCCESS_MESSAGE = 'FORM.MESSAGES.SAVE_SUCCESS';
    private static REASON_PLACEHOLDER = 'OPERATIONS.CONTINGENCY_FORM.REASON_PLACEHOLDER';
    private static EDIT_FORM_TITLE = 'FORM.EDIT_FORM_TITLE';
    private static REASON_ATTRIBUTE = 'reason';
    private static REASON_FIELD_TYPE = 'textarea';

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
    private _editReasonSub: Subscription;
    private _editFieldTranslation: EditFieldTranslationInterface;
    private _toEdit: number;

    constructor(
        private _messageData: DataService,
        private _translationService: TranslationService,
        private _apiRestService: ApiRestService,
        private _layoutService: LayoutService,
        private _dialogService: DialogService,
        private _storageService: StorageService,
        private _aogService: AogService
    ) {
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
        this._editReasonSub = new Subscription();
        this._editFieldTranslation = {field: {value: ''}, placeholder: ''};
        this._toEdit = null;
    }

    ngOnInit() {
        this.intervalToRefresh = AogListComponent.DEFAULT_INTERVAL;
        this.paginatorObjectService = PaginatorObjectService.getInstance();
        this.reloadSubscription = this._messageData.currentStringMessage.subscribe(message => this.reloadList(message));
        this.intervalRefreshSubscription = this.getIntervalToRefresh();
        this.paginatorSubscription = this.getPaginationSubscription();
        this._translationService
            .translate([AogListComponent.REASON_PLACEHOLDER, AogListComponent.EDIT_FORM_TITLE])
            .then(v => {
                this.editFieldTranslation.placeholder = v[AogListComponent.REASON_PLACEHOLDER];
                this.editFieldTranslation.field = {value: v[AogListComponent.REASON_PLACEHOLDER]};
            });
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
        this.editReasonSub.unsubscribe();
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
     * Set a subscription for get total amount of records and data list.
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

    /**
     * Observable for AOG list count service
     * @param {AogSearch} search
     * @returns {Observable<Count>}
     */
    private getCount$(search: AogSearch): Observable<Count> {
        return this._aogService
            .getTotalRecords(search)
            .pipe(
                tap(response => this.paginatorObjectService.length = response.items)
            );
    }

    /**
     * Subscription for get time for reload data
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

    /**
     * Open a modal for close AOG
     * @param {Aog} aog
     */
    public openCloseAircraftOnGround(aog: Aog) {
        this._dialogService.openDialog(CloseAogComponent, {
            data: aog,
            hasBackdrop: true,
            disableClose: true,
            height: '50%',
            width: '500px'
        });
    }

    /**
     * Open a modal for edit a contingency reason field
     * @param {Aog} aog
     */
    public editReason(aog: Aog): void {
        const dataInterface = this.getDataInterface(aog);
        const ref = this._dialogService.openDialog(EditFieldComponent, {
            data: dataInterface,
            width: '400px',
            height: '350px',
            hasBackdrop: true
        }).componentInstance;
        this.editReasonSub = ref.submit.subscribe(
            description => this.postEditReason(this.getReasonSignature(aog.id, description), dataInterface),
            err => console.error(err)
        );
    }

    /**
     * Get data interface for Edit Field Component
     * @param {string} content
     * @returns {EditFieldDataInterface}
     */
    private getDataInterface(aog: Aog): EditFieldDataInterface {
        return {
            content: aog.reason,
            type: AogListComponent.REASON_FIELD_TYPE,
            attribute: AogListComponent.REASON_ATTRIBUTE,
            translation: this.editFieldTranslation,
            title: aog.tail.concat(' / ').concat(aog.fleet)
        };
    }

    /**
     * Get signature for edit reason
     * @param {number} id
     * @param {string} description
     * @returns {Reason}
     */
    private getReasonSignature(id: number, description: string): Reason {
        const reason = Reason.getInstance();
        reason.description = description;
        reason.id = id;
        reason.audit = Audit.getInstance();
        reason.audit.username = this.username;
        return reason;
    }

    /**
     *
     * @param {Reason} reason
     * @param {EditFieldDataInterface} dataInterface
     * @returns {Promise<void>}
     */
    private postEditReason(reason: Reason, dataInterface: EditFieldDataInterface): Promise<void> {
        return this._apiRestService
            .add(AogListComponent.EDIT_REASON_AOG_ENDPOINT, reason)
            .toPromise()
            .then(() => {
                this._translationService.translateAndShow(AogListComponent.SUCCESS_MESSAGE, 2500, {value: dataInterface.translation.field.value.toLowerCase()});
                this._dialogService.closeAllDialogs();
                this._messageData.stringMessage('reload');
            })
            .catch(() => this._translationService.translateAndShow(AogListComponent.DEFAULT_ERROR_MESSAGE));
    }

    public openRecoveryPlan(selectedAog: Aog): void {
        this._dialogService.openDialog(RecoveryPlanComponent, {
            maxWidth: '100vw',
            width: '100%',
            height: '100%',
            hasBackdrop: false,
            data: selectedAog
        });
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

    get editReasonSub(): Subscription {
        return this._editReasonSub;
    }

    set editReasonSub(value: Subscription) {
        this._editReasonSub = value;
    }

    get editFieldTranslation(): EditFieldTranslationInterface {
        return this._editFieldTranslation;
    }

    set editFieldTranslation(value: EditFieldTranslationInterface) {
        this._editFieldTranslation = value;
    }

    get username(): string {
        return this._storageService.getCurrentUser().username;
    }

    get toEdit(): number {
        return this._toEdit;
    }

    set toEdit(value: number) {
        this._toEdit = value;
    }
}
