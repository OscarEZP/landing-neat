import {Pagination} from '../common/pagination';
import {TimeInstant} from '../timeInstant';

export class PlannedFlightSearch {

    private _hoursInterval: number;
    private _pagination: Pagination;
    private _from: TimeInstant;

    constructor(hoursInterval: number = 0, pagination: Pagination = Pagination.getInstance(), from: TimeInstant = TimeInstant.getInstance()) {
        this._hoursInterval = hoursInterval;
        this._pagination = pagination;
        this._from = from;
    }

    get hoursInterval(): number {
        return this._hoursInterval;
    }

    set hoursInterval(value: number) {
        this._hoursInterval = value;
    }

    get pagination(): Pagination {
        return this._pagination;
    }

    set pagination(value: Pagination) {
        this._pagination = value;
    }

    get from(): TimeInstant {
        return this._from;
    }

    set from(value: TimeInstant) {
        this._from = value;
    }
}
