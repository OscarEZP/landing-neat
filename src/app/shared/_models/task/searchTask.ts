export class SearchTask {

    private _offSet: number;
    private _limit: number;

    constructor(offSet: number, limit: number) {
        this._offSet = offSet;
        this._limit = limit;
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
