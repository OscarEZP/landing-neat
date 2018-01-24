export class Activity {

    private _code: string;
    private _apply: boolean;
    private _done: boolean;

    constructor (code: string, apply: boolean, done: boolean) {
        this.code = code;
        this.apply = apply;
        this.done = done;
    }

    get code (): string {
        return this._code;
    }

    set code (value: string) {
        this._code = value;
    }

    get apply (): boolean {
        return this._apply;
    }

    set apply (value: boolean) {
        this._apply = value;
    }

    get done(): boolean {
        return this._done;
    }

    set done(value: boolean) {
        this._done = value;
    }
}
