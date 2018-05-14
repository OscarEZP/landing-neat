import {Access} from './access';
import {DetailStation} from './detailStation';
import {Audit} from '../common/audit';

export class ManagementUser {
    private _username: string;
    private _firstname: string;
    private _lastname: string;
    private _email: string;
    private _detailStation: DetailStation;
    private _access: Access[];
    private _enable: boolean;
    private _audit: Audit;


    constructor(username: string, firstname: string, lastname: string, email: string, detailStation: DetailStation, access: Access[], audit: Audit) {
        this._username = username;
        this._firstname = firstname;
        this._lastname = lastname;
        this._email = email;
        this._detailStation = detailStation;
        this._access = access;
        this._audit = audit;
    }

    public static getInstance() {
        return new ManagementUser('', '', '', '', DetailStation.getInstance(), [], Audit.getInstance());
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
        this._detailStation = Object.assign(DetailStation.getInstance(), value);
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


    get audit(): Audit {
        return this._audit;
    }

    set audit(value: Audit) {
        this._audit = value;
    }
}
