export class Review {
    private _barcode: string;
    private _apply: boolean;

    constructor() {
        this.barcode = '';
        this.apply = null;

    }

    public static getInstance() {
        return new Review();
    }


    get barcode(): string {
        return this._barcode;
    }

    set barcode(value: string) {
        this._barcode = value;
    }


    get apply(): boolean {
        return this._apply;
    }

    set apply(value: boolean) {
        this._apply = value;
    }

}
