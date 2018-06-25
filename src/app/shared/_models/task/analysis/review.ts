export class Review {
    private _barcode: string;
    private _apply: boolean | null;
    private _reviews: Review[];

    constructor(barcode: string = '', apply: boolean = null, reviews: Review[] = [])  {
        this._barcode = barcode;
        this._apply = apply;
        this._reviews = reviews;
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

    get reviews(): Review[] {
        return this._reviews;
    }

    set reviews(value: Review[]) {
        this._reviews = value;
    }
}
