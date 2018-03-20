export class Analysis {
    private _barcode: string;
    private _status: string;

    constructor() {
        this._barcode = '';
        this._status = '';
    }
    public static getInstance() {
        return new Analysis();
    }


    get barcode(): string {
        return this._barcode;
    }

    set barcode(value: string) {
        this._barcode = value;
    }


    get status(): string {
        return this._status;
    }

    set status(value: string) {
        this._status = value;
    }
}
