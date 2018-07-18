import {Pagination} from '../common/pagination';
export class AogSearch {

    private _pagination: Pagination;

    private constructor(pagination: Pagination) {
        this._pagination = pagination;

    }

    static getInstance(): AogSearch {
        return new AogSearch(Pagination.getInstance());
    }


    get pagination(): Pagination {
        return this._pagination;
    }

    set pagination(value: Pagination) {
        this._pagination = value;
    }
}
