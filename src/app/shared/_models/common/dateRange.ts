import {TimeInstant} from '../timeInstant';

export class DateRange {

    private _from: TimeInstant;
    private _to: TimeInstant;

    constructor(from: TimeInstant, to: TimeInstant) {
        this._from = from;
        this._to = to;
    }

    static getInstance(): DateRange {
        return new DateRange(TimeInstant.getInstance(), TimeInstant.getInstance());
    }
}
