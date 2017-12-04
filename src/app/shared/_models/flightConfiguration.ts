import { Legs } from './legs';
import { TimeInstant } from './timeInstant';

export class FlightConfiguration {
        private _flightNumber: string;
    private _legs: Legs[];
    private _etd: TimeInstant;

    constructor(flightNumber: string, legs: Legs[], etd: TimeInstant) {
        this._flightNumber = flightNumber;
        this._legs = legs;
        this._etd = etd;
    }

    get flightNumber(): string {
        return this._flightNumber;
    }

    set flightNumber(value: string) {
        this._flightNumber = value;
    }

    get legs(): Legs[] {
        return this._legs;
    }

    set legs(value: Legs[]) {
        this._legs = value;
    }

    get etd(): TimeInstant {
        return this._etd;
    }

    set etd(value: TimeInstant) {
        this._etd = value;
    }
}
