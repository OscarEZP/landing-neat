import {Pagination} from "../common/pagination";

export class SearchTask {


    private _outOfStandard: boolean;
    private _pagination:Pagination;

    constructor() {
        this.pagination = Pagination.getInstance();
        this.outOfStandard = false;
    }

    static getInstance(): SearchTask {
        return new SearchTask();
    }


    set outOfStandard(value: boolean) {
        this._outOfStandard = value;
    }


    set pagination(value: Pagination) {
        this._pagination = value;
    }
}
