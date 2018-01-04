export class Address {

    private _formatted: string;

    constructor(formatted: string) {
        this._formatted = formatted;
    }

    get formatted(): string {
        return this._formatted;
    }

    set formatted(value: string) {
        this._formatted = value;
    }
}
