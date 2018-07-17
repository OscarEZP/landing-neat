import {TimeInstant} from '../timeInstant';
import {Interval} from '../interval';
export class StatusAog {

    private _aogId: number;
    private _code: string;
    private _observation: string;
    private _requestedInterval: Interval;
    private _realInterval: Interval;
    private _username: string;
    private _creationDate: TimeInstant;

    constructor(
        code: string,
        aogId: number,
        creationDate: TimeInstant,
        observation: string,
        realInterval: Interval,
        requestedInterval: Interval,
        username: string
    ) {
        this._code = code;
        this._aogId = aogId;
        this._creationDate = creationDate != null ? creationDate : TimeInstant.getInstance();
        this._observation = observation;
        this._realInterval = realInterval != null ? realInterval : Interval.getInstance();
        this._requestedInterval = requestedInterval != null ? requestedInterval : Interval.getInstance();
        this._username = username;
    }

    static getInstance(): StatusAog {
        return new StatusAog(null, null, null, null, null, null, null);
    }

    get aogId(): number {
        return this._aogId;
    }

    set aogId(value: number) {
        this._aogId = value;
    }

    get code(): string {
        return this._code;
    }

    set code(value: string) {
        this._code = value;
    }

    get observation(): string {
        return this._observation;
    }

    set observation(value: string) {
        this._observation = value;
    }

    get requestedInterval(): Interval {
        return this._requestedInterval;
    }

    set requestedInterval(value: Interval) {
        this._requestedInterval = value;
    }

    get realInterval(): Interval {
        return this._realInterval;
    }

    set realInterval(value: Interval) {
        this._realInterval = value;
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

    get creationDate(): TimeInstant {
        return this._creationDate;
    }

    set creationDate(value: TimeInstant) {
        this._creationDate = value;
    }
}

