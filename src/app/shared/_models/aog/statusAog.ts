import {Interval} from '../interval';
import {Audit} from '../common/audit';

export class StatusAog {

    private _aogId: number;
    private _code: string;
    private _observation: string;
    private _requestedInterval: Interval;
    private _realInterval: Interval;
    private _audit: Audit;

    private constructor(code: string,
                        aogId: number,
                        observation: string,
                        realInterval: Interval,
                        requestedInterval: Interval,
                        audit: Audit) {
        this._code = code;
        this._aogId = aogId;
        this._observation = observation;
        this._realInterval = realInterval;
        this._requestedInterval = requestedInterval;
        this._audit = audit;
    }

    static getInstance(): StatusAog {
        return new StatusAog(null, null, null, Interval.getInstance(), Interval.getInstance(), Audit.getInstance());
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

    get audit(): Audit {
        return this._audit;
    }

    set audit(value: Audit) {
        this._audit = value;
    }
}

