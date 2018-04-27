import {Module} from './module';
import {TimeInstant} from '../timeInstant';

export class ManagementUser {
    private _username: string;
    private _firstname: string;
    private _lastname: string;
    private _email: string;
    private _locations: string[];
    private _modules: Module[];
    private _enable: boolean;
    private _createDate: TimeInstant;
    private _updateDate: TimeInstant;


    constructor(username: string, firstname: string, lastname: string, email: string, locations: string[], modules: Module[], enable: boolean, createDate: TimeInstant, updateDate: TimeInstant) {
        this._username = username;
        this._firstname = firstname;
        this._lastname = lastname;
        this._email = email;
        this._locations = locations;
        this._modules = modules;
        this._enable = enable;
        this._createDate = createDate;
        this._updateDate = updateDate;
    }

    public static getInstance() {
        return new ManagementUser('', '', '', '', [], [], false, TimeInstant.getInstance(), TimeInstant.getInstance());
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

    get locations(): string[] {
        return this._locations;
    }

    set locations(value: string[]) {
        this._locations = value;
    }

    get modules(): Module[] {
        return this._modules;
    }

    set modules(value: Module[]) {
        this._modules = value;
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
