export class Count {

    private _items: number;

    constructor(items: number) {
        this._items = items;
    }
    public static getInstance() {
        return new Count(0);
    }
    get items(): number {
        return this._items;
    }

    set items(value: number) {
        this._items = value;
    }
}
