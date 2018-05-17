import {Pagination} from '../../common/pagination';

export class TaskSearch {


    private _outOfStandard: boolean;
    private _pagination: Pagination;

    constructor() {
        this.pagination = Pagination.getInstance();
        this.outOfStandard = false;
    }

    static getInstance(): TaskSearch {
        return new TaskSearch();
    }


    set outOfStandard(value: boolean) {
        this._outOfStandard = value;
    }


    set pagination(value: Pagination) {
        this._pagination = value;
    }
}
