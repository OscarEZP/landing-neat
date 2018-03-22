export class Remark {
    private _header:string;
    private _body:string;
    private _order:number;

    private constructor() {
        this._header = '';
        this._body = '';
        this._order=null;
    }
    public static getInstance() {
        return new Remark();
    }


    get header(): string {
        return this._header;
    }

    set header(value: string) {
        this._header = value;
    }

    get body(): string {
        return this._body;
    }

    set body(value: string) {
        this._body = value;
    }

    get order(): number {
        return this._order;
    }

    set order(value: number) {
        this._order = value;
    }
}
