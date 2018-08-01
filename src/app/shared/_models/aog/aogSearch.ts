import {Pagination} from '../common/pagination';
export class AogSearch {

    private _pagination: Pagination;
    private _isClose: boolean;
    private _tails: string[];

    private constructor(pagination: Pagination, isClose: boolean, tails: string[]) {
        this._pagination = pagination;
        this._isClose = isClose;
        this._tails = tails;

    }

    static getInstance(): AogSearch {
        return new AogSearch(Pagination.getInstance(), false, []);
    }


    get pagination(): Pagination {
        return this._pagination;
    }

    set pagination(value: Pagination) {
        this._pagination = value;
    }

    get isClose(): boolean {
        return this._isClose;
    }

    set isClose(value: boolean) {
        this._isClose = value;
    }

    get tails(): string[] {
        return this._tails;
    }

    set tails(value: string[]) {
        this._tails = value;
    }
}
