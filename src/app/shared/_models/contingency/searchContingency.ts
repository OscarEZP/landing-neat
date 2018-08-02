import {TimeInstant} from '../timeInstant';

export class SearchContingency {

    private _offSet: number;
    private _limit: number;
    private _tails: string[];
    private _from: TimeInstant;
    private _to: TimeInstant;
    private _isClose: boolean;
    private _isPending: boolean;

    constructor(offSet: number, limit: number, tails: string[], from: TimeInstant, to: TimeInstant, isClose: boolean, isPending: boolean) {
        this._offSet = offSet;
        this._limit = limit;
        this._tails = tails;
        this._from = from;
        this._to = to;
        this._isClose = isClose;
        this._isPending = isPending;
    }
    static getInstance(): SearchContingency {
        return new SearchContingency(null, null, [], TimeInstant.getInstance(), TimeInstant.getInstance(), false, false);
    }

    get offSet(): number {
        return this._offSet;
    }

    set offSet(value: number) {
        this._offSet = value;
    }

    get limit(): number {
        return this._limit;
    }

    set limit(value: number) {
        this._limit = value;
    }

    get tails(): string[] {
        return this._tails;
    }

    set tails(value: string[]) {
        this._tails = value;
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

    get isClose(): boolean {
        return this._isClose;
    }

    set isClose(value: boolean) {
        this._isClose = value;
    }

    get isPending(): boolean {
        return this._isPending;
    }

    set isPending(value: boolean) {
        this._isPending = value;
    }
}
