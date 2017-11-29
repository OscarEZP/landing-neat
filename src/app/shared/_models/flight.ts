export class Flight {

    private _flightNumber: string;
    private _origin: string;
    private _destination: string;

    constructor(flightNumber: string, origin: string, destination: string) {
        this._flightNumber = flightNumber;
        this._origin = origin;
        this._destination = destination;
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
}
