import { TimeInstant } from '../timeInstant';

export class FlightSearch {

    private _tail: string;
    private _offSet: number;
    private _limit: number;
    private _from: TimeInstant;


    constructor(from: TimeInstant) {
        this._from = from;
    }

    get tail(): string {
        return this._tail;
    }

    set tail(value: string) {
        this._tail = value;
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

    get from(): TimeInstant {
        return this._from;
    }

    set from(value: TimeInstant) {
        this._from = value;
    }
}
