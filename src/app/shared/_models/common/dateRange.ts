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

    get from(): TimeInstant {
        return this._from;
    }

    set from(value: TimeInstant) {
        this._from = value;
    }

    get to(): TimeInstant {
        return this._to;
    }

    set to(value: TimeInstant) {
        this._to = value;
    }

    get fromEpochtime(): number {
        return this.from.epochTime;
    }

    get toEpochtime(): number {
        return this.to.epochTime;
    }
}
