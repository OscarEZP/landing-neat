import {DateRange} from '../common/dateRange';
export class Stage {

    private _code: string;
    private _serie: number; // Por ahora fijo en 1
    private _range: DateRange;


    constructor(code: string, serie: number, range: DateRange) {
        this._code = code;
        this._serie = serie;
        this._range = range;
    }

    getInstance(): Stage {
        return new Stage(null, null, DateRange.getInstance());
    }

    get code(): string {
        return this._code;
    }

    set code(value: string) {
        this._code = value;
    }

    get serie(): number {
        return this._serie;
    }

    set serie(value: number) {
        this._serie = value;
    }

    get range(): DateRange {
        return this._range;
    }

    set range(value: DateRange) {
        this._range = value;
    }

    get fromEpochtime(): number {
        return this.range.fromEpochtime;
    }

    set fromEpochtime(value: number) {
        this.range.fromEpochtime = value;
    }

    get toEpochtime(): number {
        return this.range.toEpochtime;
    }

    set toEpochtime(value: number) {
        this.range.toEpochtime = value;
    }

    get duration(): number {
        return this.toEpochtime - this.fromEpochtime;
    }
}
