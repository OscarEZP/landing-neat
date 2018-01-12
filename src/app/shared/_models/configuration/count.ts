export class Count {

    private _items: number;

    constructor(items: number) {
        this._items = items;
    }

    get items(): number {
        return this._items;
    }

    set items(value: number) {
        this._items = value;
    }
}
