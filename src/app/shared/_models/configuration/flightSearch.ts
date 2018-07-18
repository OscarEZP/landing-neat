export class FlightSearch {

    private _tail: string;
    private _offSet: number;
    private _limit: number;

    constructor(tail: string, offSet: number, limit: number) {
        this._tail = tail;
        this._offSet = offSet;
        this._limit = limit;
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

}
