export class SearchTask {

    private _offSet: number;
    private _limit: number;
    private _outOfStandard: boolean;

    constructor(offSet: number, limit: number, outOfStandard: boolean) {
        this._offSet = offSet;
        this._limit = limit;
        this._outOfStandard = outOfStandard;
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
