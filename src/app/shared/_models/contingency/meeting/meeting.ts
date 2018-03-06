import { Activity } from './activity';
import { Assistant } from './assistant';
import { TimeInstant } from '../../timeInstant';

export class Meeting {
    private _id: number;
    private _contingencyId: number;
    private _activities: Array<Activity>;
    private _barcode: string;
    private _createUser: string;
    private _timeInstant: TimeInstant;
    private _safetyCode: string;
    private _assistants: Array<Assistant>;

    constructor(id: number, contingencyId: number, activities: Array<Activity>, barcode: string, createUser: string, timeInstant: TimeInstant, safetyCode: string, assistants: Array<Assistant>) {
        this.id = id;
        this.contingencyId = contingencyId;
        this.activities = activities;
        this.barcode = barcode;
        this.createUser = createUser;
        this.timeInstant = timeInstant !== null ? timeInstant : TimeInstant.getInstance();
        this.safetyCode = safetyCode;
        this.assistants = assistants;
    }

    set safetyCode(value: string) {
        this._safetyCode = value;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    set contingencyId(value: number) {
        this._contingencyId = value;
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

    set createUser(value: string) {
        this._createUser = value;
    }

    get timeInstant(): TimeInstant {
        return this._timeInstant;
    }

    set timeInstant(value: TimeInstant) {
        this._timeInstant = value;
    }

    set assistants(value: Array<Assistant>) {
        this._assistants = value;
    }
}
