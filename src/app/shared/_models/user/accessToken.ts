import { Address } from './address';

export class AccessToken {

    private _sub: string;
    private _email_verified: boolean;
    private _address: Address;
    private _birthDate: string;
    private _profile: string;
    private _iss: string;
    private _phone_number_verified: boolean;
    private _given_name: string;
    private _aud: string;
    private _event_id: string;
    private _token_use: string;
    private _auth_time: number;
    private _name: string;
    private _phone_number: string;
    private _exp: number;
    private _iat: number;
    private _family_name: string;
    private _email: string;

    constructor(sub: string, email_verified: boolean, address: Address, birthDate: string, profile: string, iss: string, phone_number_verified: boolean, given_name: string, aud: string, event_id: string, token_use: string, auth_time: number, name: string, phone_number: string, exp: number, iat: number, family_name: string, email: string) {
        this._sub = sub;
        this._email_verified = email_verified;
        this._address = address;
        this._birthDate = birthDate;
        this._profile = profile;
        this._iss = iss;
        this._phone_number_verified = phone_number_verified;
        this._given_name = given_name;
        this._aud = aud;
        this._event_id = event_id;
        this._token_use = token_use;
        this._auth_time = auth_time;
        this._name = name;
        this._phone_number = phone_number;
        this._exp = exp;
        this._iat = iat;
        this._family_name = family_name;
        this._email = email;
    }

    get sub(): string {
        return this._sub;
    }

    set sub(value: string) {
        this._sub = value;
    }

    get email_verified(): boolean {
        return this._email_verified;
    }

    set email_verified(value: boolean) {
        this._email_verified = value;
    }

    get address(): Address {
        return this._address;
    }

    set address(value: Address) {
        this._address = value;
    }

    get birthDate(): string {
        return this._birthDate;
    }

    set birthDate(value: string) {
        this._birthDate = value;
    }

    get profile(): string {
        return this._profile;
    }

    set profile(value: string) {
        this._profile = value;
    }

    get iss(): string {
        return this._iss;
    }

    set iss(value: string) {
        this._iss = value;
    }

    get phone_number_verified(): boolean {
        return this._phone_number_verified;
    }

    set phone_number_verified(value: boolean) {
        this._phone_number_verified = value;
    }

    get given_name(): string {
        return this._given_name;
    }

    set given_name(value: string) {
        this._given_name = value;
    }

    get aud(): string {
        return this._aud;
    }

    set aud(value: string) {
        this._aud = value;
    }

    get event_id(): string {
        return this._event_id;
    }

    set event_id(value: string) {
        this._event_id = value;
    }

    get token_use(): string {
        return this._token_use;
    }

    set token_use(value: string) {
        this._token_use = value;
    }

    get auth_time(): number {
        return this._auth_time;
    }

    set auth_time(value: number) {
        this._auth_time = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get phone_number(): string {
        return this._phone_number;
    }

    set phone_number(value: string) {
        this._phone_number = value;
    }

    get exp(): number {
        return this._exp;
    }

    set exp(value: number) {
        this._exp = value;
    }

    get iat(): number {
        return this._iat;
    }

    set iat(value: number) {
        this._iat = value;
    }

    get family_name(): string {
        return this._family_name;
    }

    set family_name(value: string) {
        this._family_name = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }
}
