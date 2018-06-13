import { TimeInstant } from './timeInstant';

export class Flight {

    private _flightNumber: string;
    private _origin: string;
    private _destination: string;
    private _etd: TimeInstant;

    constructor(flightNumber: string, origin: string, destination: string, etd: TimeInstant) {
        this._flightNumber = flightNumber;
        this._origin = origin;
        this._destination = destination;
        this._etd = etd != null ? etd : TimeInstant.getInstance();
    }
    static getInstance(): Flight {
        return new Flight(null, null, null, null);
    }

    get flightNumber(): string {
        return this._flightNumber;
    }

    set flightNumber(value: string) {
        this._flightNumber = value;
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
}
