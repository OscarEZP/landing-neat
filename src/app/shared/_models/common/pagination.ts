export class Pagination {

    private _offSet: number;
    private _limit: number;

    constructor( offset: number, limit: number) {
        this.offSet= offset;
        this.limit = limit;
    }
    static getInstance():Pagination{
        return new Pagination(null,null);
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