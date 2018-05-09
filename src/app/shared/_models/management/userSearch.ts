import {Pagination} from '../common/pagination';

export class UserSearch {
    private _pagination: Pagination;
    private _enable: string[];

    constructor(pagination: Pagination, enable: string[]) {
        this._pagination = pagination;
        this._enable = enable;
    }

    public static getInstance(): UserSearch {
        return new UserSearch(new Pagination(0, 0), []);
    }

    get pagination(): Pagination {
        return this._pagination;
    }

    set pagination(value: Pagination) {
        this._pagination = value;
    }

    get enable(): string[] {
        return this._enable;
    }

    set enable(value: string[]) {
        this._enable = value;
    }
}
