import { TimeInstant } from './timeInstant';

export class Legs {

    private _origin: string;
    private _destination: string;
    private _etd: TimeInstant;
    private _updateDate: TimeInstant;
    private _tail: string;

    constructor(origin: string, destination: string, etd: TimeInstant, updateDate: TimeInstant, tail: string) {
        this._origin = origin;
        this._destination = destination;
        this._etd =etd!=null?etd:TimeInstant.getInstance();
        this._updateDate =updateDate!=null?updateDate:TimeInstant.getInstance();
        this._tail = tail;
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

    get etd(): TimeInstant {
        return this._etd;
    }

    set etd(value: TimeInstant) {
        this._etd = value;
    }

    get updateDate(): TimeInstant {
        return this._updateDate;
    }

    set updateDate(value: TimeInstant) {
        this._updateDate = value;
    }

    get tail(): string {
        return this._tail;
    }

    set tail(value: string) {
        this._tail = value;
    }
}
