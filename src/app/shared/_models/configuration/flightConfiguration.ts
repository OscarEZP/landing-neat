import { Legs } from '../legs';

export class FlightConfiguration {
    private _flightNumber: string;
    private _legs: Legs;

    constructor(flightNumber: string, legs: Legs) {
        this._flightNumber = flightNumber;
        this._legs = legs;
    }

    get flightNumber(): string {
        return this._flightNumber;
    }

    set flightNumber(value: string) {
        this._flightNumber = value;
    }

    get legs(): Legs {
        return this._legs;
    }

    set legs(value: Legs) {
        this._legs = value;
    }
}
