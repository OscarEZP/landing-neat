export class Activity {
    private _code: string;
    private _apply: boolean;
    private _done: boolean;


    constructor(code: string, apply: boolean, done: boolean) {
        this._code = code;
        this._apply = apply;
        this._done = done;
    }

    static getInstance(): Activity {
        return new Activity(null, false, false);
    }
    get code(): string {
        return this._code;
    }

    set code(value: string) {
        this._code = value;
    }

    get apply(): boolean {
        return this._apply;
    }

    get done(): boolean {
        return this._done;
    }

    set done(value: boolean) {
        this._done = value;
    }
}
