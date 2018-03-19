export class Name {

    private _firstName: string;
    private _lastNme: string;

    constructor( firstName: string, lastName: string) {
        this.firstName= firstName;
        this._lastNme = lastName;
    }
    static getInstance():Name{
        return new Name(null,null);
    }

    get firstName(): string {
        return this._firstName;
    }

    set firstName(value: string) {
        this._firstName = value;
    }
}