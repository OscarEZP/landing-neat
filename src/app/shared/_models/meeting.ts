import { Activity } from './activity';
import { TimeInstant } from './timeInstant';

export class Meeting {
    private _id: number;
    private _contingencyId: number;
    private _activities: Array<Activity>;
    private _barcode: string;
    private _createUser: string;
    private _timeInstant: TimeInstant;

    constructor(id: number, contingencyId: number, activities: Array<Activity>, barcode: string, createUser: string, timeInstant: TimeInstant) {
        this._id = id;
        this._contingencyId = contingencyId;
        this._activities = activities;
        this._barcode = barcode;
        this._createUser = createUser;
        this._timeInstant = timeInstant;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get contingencyId(): number {
        return this._contingencyId;
    }

    set contingencyId(value: number) {
        this._contingencyId = value;
    }

    get activities(): Array<Activity> {
        return this._activities;
    }

    set activities(value: Array<Activity>) {
        this._activities = value;
    }

    get barcode(): string {
        return this._barcode;
    }

    set barcode(value: string) {
        this._barcode = value;
    }

    get createUser(): string {
        return this._createUser;
    }

    set createUser(value: string) {
        this._createUser = value;
    }

    get timeInstant(): TimeInstant {
        return this._timeInstant;
    }

    set timeInstant(value: TimeInstant) {
        this._timeInstant = value;
    }
}
