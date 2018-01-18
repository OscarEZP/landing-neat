import { Interval } from './interval';
import { TimeInstant } from './timeInstant';

export class Status {

    private _code: string;
    private _level: number;
    private _contingencyId: number;
    private _creationDate: TimeInstant;
    private _observation: string;
    private _realInterval: Interval;
    private _requestedInterval: Interval;
    private _username: string;

    constructor(code: string, level: number, contingencyId: number, creationDate: TimeInstant, observation: string, realInterval: Interval, requestedInterval: Interval, username: string) {
        this._code = code;
        this._level = level;
        this._contingencyId = contingencyId;
        this._creationDate = creationDate;
        this._observation = observation;
        this._realInterval = realInterval;
        this._requestedInterval = requestedInterval;
        this._username = username;
    }

    get code(): string {
        return this._code;
    }

    set code(value: string) {
        this._code = value;
    }

    get level(): number {
        return this._level;
    }

    set level(value: number) {
        this._level = value;
    }

    get contingencyId(): number {
        return this._contingencyId;
    }

    set contingencyId(value: number) {
        this._contingencyId = value;
    }

    get creationDate(): TimeInstant {
        return this._creationDate;
    }

    set creationDate(value: TimeInstant) {
        this._creationDate = value;
    }

    get observation(): string {
        return this._observation;
    }

    set observation(value: string) {
        this._observation = value;
    }

    get realInterval(): Interval {
        return this._realInterval;
    }

    set realInterval(value: Interval) {
        this._realInterval = value;
    }

    get requestedInterval(): Interval {
        return this._requestedInterval;
    }

    set requestedInterval(value: Interval) {
        this._requestedInterval = value;
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }
}


