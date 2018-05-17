

export class TechnicalStation {

    private _station: string;
    private _authorities: string[];

    public constructor(station: string,  authorities: string[]) {
        this._station = station;
        this._authorities = authorities;
    }

    static getInstance(): TechnicalStation {
        return new TechnicalStation(null, []);
    }

    get station(): string {
        return this._station;
    }

    set station(value: string) {
        this._station = value;
    }

    get authorities(): string[] {
        return this._authorities;
    }

    set authorities(value: string[]) {
        this._authorities = value;
    }
}
