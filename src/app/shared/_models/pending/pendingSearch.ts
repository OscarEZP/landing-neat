import {Pagination} from "../common/pagination";
import {DateRange} from "../common/dateRange";

export class PendingSearch {

    private _pagination: Pagination;
    private _dateRange: DateRange;
    private _contingencyId: number;
    private _meetingId: number;
    private _isResolve: boolean;

    constructor() {
        this.pagination = Pagination.getInstance();
        this.isResolve = false;
        this.dateRange = DateRange.getInstance();
        this.contingencyId=null;
        this.meetingId=null;
    }

    static getInstance(): PendingSearch {
        return new PendingSearch();
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

    get isResolve(): boolean {
        return this._isResolve;
    }

    set isResolve(value: boolean) {
        this._isResolve = value;
    }

    get contingencyId(): number {
        return this._contingencyId;
    }

    set contingencyId(value: number) {
        this._contingencyId = value;
    }

    get meetingId(): number {
        return this._meetingId;
    }

    set meetingId(value: number) {
        this._meetingId = value;
    }
}

