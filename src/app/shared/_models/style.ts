export class Style {

    private _bottom: string;
    private _top: string;
    private _left: string;

    constructor() {
        this._bottom = '';
        this._top = '';
        this._left = '';
    }

    get bottom(): string {
        return this._bottom;
    }

    set bottom(value: string) {
        this._bottom = value;
    }

    get top(): string {
        return this._top;
    }

    set top(value: string) {
        this._top = value;
    }

    get left(): string {
        return this._left;
    }

    set left(value: string) {
        this._left = value;
    }
}
