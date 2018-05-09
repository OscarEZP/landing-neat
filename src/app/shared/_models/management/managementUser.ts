import {Access} from './access';
import {DetailStation} from './detailStation';
import {TimeInstant} from '../timeInstant';

export class ManagementUser {
    private _username: string;
    private _firstname: string;
    private _lastname: string;
    private _email: string;
    private _detailStation: DetailStation;
    private _access: Access[];
    private _enable: boolean;
    private _createDate: TimeInstant;
    private _updateDate: TimeInstant;


    constructor(username: string, firstname: string, lastname: string, email: string, detailStation: DetailStation, access: Access[]) {
        this._username = username;
        this._firstname = firstname;
        this._lastname = lastname;
        this._email = email;
        this._detailStation = detailStation;
        this._access = access;
    }

    public static getInstance() {
        return new ManagementUser('', '', '', '', DetailStation.getInstance(), []);
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

    get firstname(): string {
        return this._firstname;
    }

    set firstname(value: string) {
        this._firstname = value;
    }

    get lastname(): string {
        return this._lastname;
    }

    set lastname(value: string) {
        this._lastname = value;
    }

    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }

    get detailStation(): DetailStation {
        return this._detailStation;
    }

    set detailStation(value: DetailStation) {
        this._detailStation = value;
    }

    get access(): Access[] {
        return this._access;
    }

    set access(value: Access[]) {
        this._access = value;
    }

    get enable(): boolean {
        return this._enable;
    }

    set enable(value: boolean) {
        this._enable = value;
    }

    get createDate(): TimeInstant {
        return this._createDate;
    }

    set createDate(value: TimeInstant) {
        this._createDate = value;
    }

    get updateDate(): TimeInstant {
        return this._updateDate;
    }

    set updateDate(value: TimeInstant) {
        this._updateDate = value;
    }

}
