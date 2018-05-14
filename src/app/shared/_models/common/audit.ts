import {TimeInstant} from '../timeInstant';

export class Audit {

    private _time: TimeInstant;
    private _username: string;

   private constructor( time: TimeInstant, username: string) {
        this._time = time;
        this._username = username;
    }
    static getInstance(): Audit {
        return new Audit(TimeInstant.getInstance(), null);
    }

    get time(): TimeInstant {
        return this._time;
    }

    set time(value: TimeInstant) {
        this._time = value;
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }
}
