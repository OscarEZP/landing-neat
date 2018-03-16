import {DateRange} from "../common/dateRange";
import {Pagination} from "../common/pagination";

export class searchRelationedTask {

    private _tail: string;
    private _ataGroup: string;
    private _pagination: Pagination;
    private _dateRange: DateRange;


    constructor() {

        this._pagination = Pagination.getInstance();
        this._dateRange = DateRange.getInstance();
    }

    get tail(): string {
        return this._tail;
    }

    set tail(value: string) {
        this._tail = value;
    }

    get ataGroup(): string {
        return this._ataGroup;
    }

    set ataGroup(value: string) {
        this._ataGroup = value;
    }

    get pagination(): Pagination {
        return this._pagination;
    }

    set pagination(value: Pagination) {
        this._pagination = value;
    }

    get dateRange(): DateRange {
        return this._dateRange;
    }

    set dateRange(value: DateRange) {
        this._dateRange = value;
    }
}