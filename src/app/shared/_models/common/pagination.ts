export class Pagination {

    private _offset: number;
    private _limit: number;

    constructor( offset: number, limit: number) {
        this.offset= offset;
        this.limit = limit;
    }
    static getInstance():Pagination{
        return new Pagination(null,null);
    }
    get offset(): number {
        return this._offset;
    }

    set offset(value: number) {
        this._offset = value;
    }

    get limit(): number {
        return this._limit;
    }

    set limit(value: number) {
        this._limit = value;
    }
}