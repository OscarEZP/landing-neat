export class Style {

    private _bottom: string;
    private _left: string;

    constructor() {
        this._bottom = '';
        this._left = '';
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
}
