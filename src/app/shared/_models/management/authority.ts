import {TimeInstant} from '../timeInstant';

export class Authority {
    private _code: string;
    private _updateDate: TimeInstant;


    private constructor(code: string, updateDate: TimeInstant) {
        this._code = code;
        this._updateDate = TimeInstant.getInstance();
    }

    public static getInstance() {
        return new Authority(null, TimeInstant.getInstance());
    }

    get code(): string {
        return this._code;
    }

    set code(value: string) {
        this._code = value;
    }

    get updateDate(): TimeInstant {
        return this._updateDate;
    }

    set updateDate(value: TimeInstant) {
        this._updateDate = value;
    }
}
