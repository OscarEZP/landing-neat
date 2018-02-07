export class Mail{

    private _address: string;

    constructor(address: string) {
        this._address = address;
    }

    get address(): string {
        return this._address;
    }

    set address(value: string) {
        this._address = value;
    }
}
