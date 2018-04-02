import {DateRange} from "../common/dateRange";
import {Pagination} from "../common/pagination";

export class SearchRelationedTask {

    private _tail: string;
    private _ataGroup: string;
    private _pagination: Pagination;
    private _dateRange: DateRange;
    private _barcode: string;


    constructor() {

        this.pagination = Pagination.getInstance();
        this.dateRange = DateRange.getInstance();
        this.tail = '';
        this.ataGroup = '';
        this.barcode = '';

    }

    static getInstance(): SearchRelationedTask {
        return new SearchRelationedTask();
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

    get barcode(): string {
        return this._barcode;
    }

    set barcode(value: string) {
        this._barcode = value;
    }
}