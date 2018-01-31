export class Assistant {
    private _mail: string;



    constructor(mail: string) {
        this._mail = mail;
    }


    get mail(): string {
        return this._mail;
    }

    set code(value: string) {
        this._mail = value;
    }


}
