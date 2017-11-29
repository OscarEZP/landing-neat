export class User {

    private _userId: string;
    private _userName: string;
    private _givenName: string;
    private _firstName: string;
    private _lastName: string;
    private _phoneNumber: string;
    private _email: string;

    constructor(userId: string, userName: string, givenName: string, firstName: string, lastName: string, phoneNumber: string, email: string) {
        this._userId = userId;
        this._userName = userName;
        this._givenName = givenName;
        this._firstName = firstName;
        this._lastName = lastName;
        this._phoneNumber = phoneNumber;
        this._email = email;
    }

    get userId(): string {
        return this._userId;
    }

    set userId(value: string) {
        this._userId = value;
    }

    get userName(): string {
        return this._userName;
    }

    set userName(value: string) {
        this._userName = value;
    }

    get givenName(): string {
        return this._givenName;
    }

    set givenName(value: string) {
        this._givenName = value;
    }

    get firstName(): string {
        return this._firstName;
    }

    set firstName(value: string) {
        this._firstName = value;
    }

    get lastName(): string {
        return this._lastName;
    }

    set lastName(value: string) {
        this._lastName = value;
    }

    get phoneNumber(): string {
        return this._phoneNumber;
    }

    set phoneNumber(value: string) {
        this._phoneNumber = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }
}
