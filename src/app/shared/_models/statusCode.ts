export class StatusCode {

    private _code: string;
    private _defaultTime: number;
    private _isVisible: boolean;

    constructor(code: string, defaultTime: number, isVisible: boolean) {
        this._code = code;
        this._defaultTime = defaultTime;
        this._isVisible = isVisible;
    }

    get code(): string {
        return this._code;
    }

    set code(value: string) {
        this._code = value;
    }

    get defaultTime(): number {
        return this._defaultTime;
    }

    set defaultTime(value: number) {
        this._defaultTime = value;
    }

    get isVisible(): boolean {
        return this._isVisible;
    }

    set isVisible(value: boolean) {
        this._isVisible = value;
    }
}
