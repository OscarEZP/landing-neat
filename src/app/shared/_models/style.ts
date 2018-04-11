export class Style {

    private _bottom: string;
    private _left: string;
    private _top: string;
    private _display: string;

    constructor() {
        this._bottom = '';
        this._left = '';
        this._top = '';
        this._display = '';
    }

    public getJson() {
        return JSON.parse(JSON.stringify(this).replace(/\b[_]/g, ''));
    }

    get bottom(): string {
        return this._bottom;
    }

    set bottom(value: string) {
        this._bottom = value;
    }

    get left(): string {
        return this._left;
    }

    set left(value: string) {
        this._left = value;
    }

    get top(): string {
        return this._top;
    }

    set top(value: string) {
        this._top = value;
    }

    get display(): string {
        return this._display;
    }

    set display(value: string) {
        this._display = value;
    }
}
