import { Interval } from './interval';

export class Status {

    private _code: string;
    private _observation: string;
    private _requestedInterval: Interval;
    private _user: string;


    constructor (code: string, observation: string, requestedInterval: Interval, user: string) {
        this._code = code;
        this._observation = observation;
        this._requestedInterval = requestedInterval;
        this._user = user;
    }


    get code (): string {
        return this._code;
    }

    set code (value: string) {
        this._code = value;
    }

    get observation (): string {
        return this._observation;
    }

    set observation (value: string) {
        this._observation = value;
    }

    get requestedInterval (): Interval {
        return this._requestedInterval;
    }

    set requestedInterval (value: Interval) {
        this._requestedInterval = value;
    }

    get user (): string {
        return this._user;
    }

    set user (value: string) {
        this._user = value;
    }
}
