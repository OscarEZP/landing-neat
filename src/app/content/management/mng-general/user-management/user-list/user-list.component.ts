import {Component, OnInit, ViewChild} from '@angular/core';
import {PaginatorObjectService} from '../../../../_services/paginator-object.service';
import {User} from '../../../../../shared/_models/user/user';
import {Observable} from 'rxjs/Observable';
import {ApiRestService} from '../../../../../shared/_services/apiRest.service';
import {TranslateService} from '@ngx-translate/core';
import {Pagination} from '../../../../../shared/_models/common/pagination';
import {UserSearch} from '../../../../../shared/_models/management/userSearch';
import {Subscription} from 'rxjs/Subscription';
import {MatPaginator} from '@angular/material';
import {tap} from 'rxjs/operators';
import {Station} from '../../../../../shared/_models/management/station';

@Component({
    selector: 'lsl-user-list',
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

    public static MANAGEMENT_USERS_SEARCH_COUNT_ENDPOINT = 'managementUsersSearchCount';
    public static MANAGEMENT_USERS_SEARCH_ENDPOINT = 'managementUsersSearch';

    @ViewChild('contPaginator') public paginator: MatPaginator;

    private _userList: Observable<User[]>;
    private _loading: boolean;
    private _error: boolean;
    private _paginatorObject: PaginatorObjectService;

    constructor(
        private _translate: TranslateService,
        private _apiRestService: ApiRestService
    ) {
        this._translate.setDefaultLang('en');
    }

    ngOnInit() {
        this.paginatorObject = PaginatorObjectService.getInstance();
        this.getPaginationSubscription();
        this.loading = false;
        this.error = false;
        this.getUserCount(this.getSearchSignature())
            .add(
                () => this.userList = this.getUserList(this.getSearchSignature())
            );
    }

    /**
     * Get total records for pagination
     * @param {UserSearch} signature
     * @returns {Subscription}
     */
    public getUserCount(signature: UserSearch): Subscription {
        return this._apiRestService.search<{items: number}>(UserListComponent.MANAGEMENT_USERS_SEARCH_COUNT_ENDPOINT, signature)
            .subscribe(res => {
                this.paginatorObject.length = res.items;
            });
    }

    /**
     * Get data list
     * @param {UserSearch} signature
     * @returns {Observable<User[]>}
     */
    public getUserList(signature: UserSearch): Observable<User[]> {
        this.loading = true;
        return this._apiRestService.search<User[]>(UserListComponent.MANAGEMENT_USERS_SEARCH_ENDPOINT, signature)
            .pipe(
                tap(() => this.loading = false)
            );
    }

    /**
     * Returns a subscription for pagination page event. Show loader and set pagination attributes in page change.
     * @return {Subscription}
     */
    public getPaginationSubscription(): Subscription {
        return this.paginator.page.subscribe((page) => {
            this.paginatorObject.pageSize = page.pageSize;
            this.paginatorObject.pageIndex = page.pageIndex;
            this.userList = this.getUserList(this.getSearchSignature());
        });
    }

    /**
     * Method for get a search signature for get data
     * @return {SearchTask}
     */
    private getSearchSignature(): UserSearch {
        return new UserSearch(
            new Pagination(this.paginatorObject.offset, this.paginatorObject.pageSize),
            ['true', 'false']
        );
    }

    /**
     * Display Label Other Stations
     * @param {Station[]} others
     * @returns {string}
     */
    public getOthersStationLbl(others: Station[]): string {
        return others && others.length > 0 ?
            others.sort((r1, r2) => r1.code > r2.code ? 1 : -1).map(value => value.code).join(', ') : '' ;
    }
    /**
     * Method for check list status with two variables, data loaded and loading process,
     * if there is not data and the list is not loading, return false
     * @return {boolean}
     */
    public checkDataStatus(): boolean {
        return this.paginatorObject.length > 10;
    }

    get userList(): Observable<User[]> {
        return this._userList;
    }

    set userList(value: Observable<User[]>) {
        this._userList = value;
    }

    get loading(): boolean {
        return this._loading;
    }

    set loading(value: boolean) {
        this._loading = value;
    }

    get error(): boolean {
        return this._error;
    }

    set error(value: boolean) {
        this._error = value;
    }

    get paginatorObject(): PaginatorObjectService {
        return this._paginatorObject;
    }

    set paginatorObject(value: PaginatorObjectService) {
        this._paginatorObject = value;
    }
}
