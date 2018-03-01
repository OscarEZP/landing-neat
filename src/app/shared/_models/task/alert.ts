export class Alert {

    private _code: string;
    private _description: string;

    constructor (code: string, description: string) {
        this._code = code;
        this._description = description;
    }

    static getInstance(): Alert {
        return new Alert(null, null);
    }

    get code (): string {
        return this._code;
    }

    set code (value: string) {
        this._code = value;
    }

    get description (): string {
        return this._description;
    }

    set description (value: string) {
        this._description = value;
    }
}
