export class AircraftSearch {

    private _enable: number;

    constructor(enable: number) {
        this._enable = enable;
    }

    get enable(): number {
        return this._enable;
    }

    set enable(value: number) {
        this._enable = value;
    }
}
