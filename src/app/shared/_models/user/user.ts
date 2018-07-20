import { Group } from './group';

export class User {

    private _firstName: string;
    private _givenName: string;
    private _lastName: string;
    private _email: string;
    private _phoneNumber: string;
    private _userId: string;
    private _username: string;
    private _password: string;
    private _idToken: string;

    private _groupList: Group[];
    private _principalGroup: string;

    private _accessToken: string;
    private _refreshToken: string;

    constructor() {
        this.firstName = '';
        this.givenName = '';
    }

    get firstName(): string {
        return this._firstName;
    }

    set firstName(value: string) {
        this._firstName = value;
    }

    get givenName(): string {
        return this._givenName;
    }

    set givenName(value: string) {
        this._givenName = value;
    }

    get lastName(): string {
        return this._lastName;
    }

    set lastName(value: string) {
        this._lastName = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get phoneNumber(): string {
        return this._phoneNumber;
    }

    set phoneNumber(value: string) {
        this._phoneNumber = value;
    }

    get userId(): string {
        return this._userId;
    }

    set userId(value: string) {
        this._userId = value;
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

    get password(): string {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
    }

    get idToken(): string {
        return this._idToken;
    }

    set idToken(value: string) {
        this._idToken = value;
    }

    get groupList(): Group[] {
        return this._groupList ? this._groupList.map(v => Object.assign(Group.getInstance(), v)) : this._groupList;
    }

    set groupList(value: Group[]) {
        value.forEach(v => Object.assign(Group.getInstance(), v));
        this._groupList = value;
    }

    get principalGroup(): string {
        return this._principalGroup;
    }

    set principalGroup(value: string) {
        this._principalGroup = value;
    }

    get accessToken(): string {
        return this._accessToken;
    }

    set accessToken(value: string) {
        this._accessToken = value;
    }

    get refreshToken(): string {
        return this._refreshToken;
    }

    set refreshToken(value: string) {
        this._refreshToken = value;
    }
}
