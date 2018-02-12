import { TimeInstant } from './timeInstant';

export class Interval {

    private _dt: TimeInstant;
    private _duration: number;


    constructor (dt: TimeInstant, duration: number) {
        this._dt =dt!=null?dt:TimeInstant.getInstance();
        this._duration = duration;
    }


    get dt (): TimeInstant {
        return this._dt;
    }

    set dt (value: TimeInstant) {
        this._dt = value;
    }

    get duration (): number {
        return this._duration;
    }

    set duration (value: number) {
        this._duration = value;
    }
}
