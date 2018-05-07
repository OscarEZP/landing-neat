export class Summary {
    private _success: number;
    private _fail: number;
    private _fails: string[];
    private _long: number;

    constructor(success: number = 0, fail: number = 0, fails: string[] = [], long: number = 0) {
        this._success = success;
        this._fail = fail;
        this._fails = fails;
        this._long = long;
    }

    get success(): number {
        return this._success;
    }

    set success(value: number) {
        this._success = value;
    }

    get fail(): number {
        return this._fail;
    }

    set fail(value: number) {
        this._fail = value;
    }

    get fails(): string[] {
        return this._fails;
    }

    set fails(value: string[]) {
        this._fails = value;
    }

    get long(): number {
        return this._long;
    }

    set long(value: number) {
        this._long = value;
    }
}
