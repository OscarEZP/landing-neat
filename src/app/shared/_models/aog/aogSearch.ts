import {Pagination} from '../common/pagination';
export class AogSearch {

    private _pagination: Pagination;
    private _isClose: Boolean;

    private constructor(pagination: Pagination, isClose: Boolean) {
        this._pagination = pagination;
        this._isClose = isClose;

    }

    static getInstance(): AogSearch {
        return new AogSearch(Pagination.getInstance(), false);
    }


    get pagination(): Pagination {
        return this._pagination;
    }

    set pagination(value: Pagination) {
        this._pagination = value;
    }

    get isClose(): Boolean {
        return this._isClose;
    }

    set isClose(value: Boolean) {
        this._isClose = value;
    }
}
