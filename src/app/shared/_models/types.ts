import { TimeInstant } from './timeInstant';

export class Types {

    private _code: string;
    private _description: string;
    private _updateDate: TimeInstant;

    constructor(code: string, description: string, updateDate: TimeInstant) {
        this._code = code;
        this._description = description;
        this._updateDate = updateDate;
    }

    get code(): string {
        return this._code;
    }

    set code(value: string) {
        this._code = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get updateDate(): TimeInstant {
        return this._updateDate;
    }

    set updateDate(value: TimeInstant) {
        this._updateDate = value;
    }
}
