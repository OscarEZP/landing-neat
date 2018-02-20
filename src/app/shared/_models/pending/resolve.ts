import {TimeInstant} from '../timeInstant';

export class Resolve {

    private _contingencyId: number;
    private _pendingId: number;
    private _username: string;
    private _updateDate: TimeInstant;


    constructor(contingencyId: number, pendingId: number, username: string) {
        this._contingencyId = contingencyId;
        this._pendingId = pendingId;
        this._username = username;
        this._updateDate = TimeInstant.getInstance();

    }

    static getInstance(): Resolve {
        return new Resolve(null, null, null);
    }


    get contingencyId(): number {
        return this._contingencyId;
    }

    set contingencyId(value: number) {
        this._contingencyId = value;
    }

    get pendingId(): number {
        return this._pendingId;
    }

    set pendingId(value: number) {
        this._pendingId = value;
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

    get updateDate(): TimeInstant {
        return this._updateDate;
    }

    set updateDate(value: TimeInstant) {
        this._updateDate = value;
    }
}