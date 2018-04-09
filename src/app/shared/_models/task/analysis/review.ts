export class Review {
    private _barcode: string;
    private _apply: boolean | null;

    constructor(barcode: string = '', apply: boolean | null = null) {
        this.barcode = barcode;
        this.apply = apply;
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


    get apply(): boolean | null {
        return this._apply;
    }

    set apply(value: boolean | null) {
        this._apply = value;
    }

}
