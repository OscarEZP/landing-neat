export class Station {
    private _code: string;

    private constructor(code: string) {
        this._code = code;
    }

    public static getInstance() {
        return new Station(null);
    }

    get code(): string {
        return this._code;
    }

    set code(value: string) {
        this._code = value;
    }
}
