export class StatusCode {

    private _code: string;
    private _description: string;
    private _level: number;
    private _isActive: boolean;
    private _defaultTime: number;

    constructor(code: string, description: string, level: number, isActive: boolean, defaultTime: number) {
        this._code = code;
        this._description = description;
        this._level = level;
        this._isActive = isActive;
        this._defaultTime = defaultTime;
    }

    get code(): string {
        return this._code;
    }

    set code(value: string) {
        this._code = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get level(): number {
        return this._level;
    }

    set level(value: number) {
        this._level = value;
    }

    get isActive(): boolean {
        return this._isActive;
    }

    set isActive(value: boolean) {
        this._isActive = value;
    }

    get defaultTime(): number {
        return this._defaultTime;
    }

    set defaultTime(value: number) {
        this._defaultTime = value;
    }
}
