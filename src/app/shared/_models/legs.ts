import { TimeInstant } from './timeInstant';

export class Legs {

    private _origin: string;
    private _destination: string;
    private _updateDate: TimeInstant;
    private _etd: TimeInstant;

    constructor(origin: string, destination: string, updateDate: TimeInstant, etd: TimeInstant) {
        this._origin = origin;
        this._destination = destination;
        this._updateDate = updateDate;
        this._etd = etd;
    }

    get origin(): string {
        return this._origin;
    }

    set origin(value: string) {
        this._origin = value;
    }

    get destination(): string {
        return this._destination;
    }

    set destination(value: string) {
        this._destination = value;
    }

    get updateDate(): TimeInstant {
        return this._updateDate;
    }

    set updateDate(value: TimeInstant) {
        this._updateDate = value;
    }

    get etd(): TimeInstant {
        return this._etd;
    }

    set etd(value: TimeInstant) {
        this._etd = value;
    }
}
