

export class TechnicalStation {

    private _station: string;
    private _authorities: String[];

    private constructor(station: string,  authorities: String[]) {
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

    get authorities(): String[] {
        return this._authorities;
    }

    set authorities(value: String[]) {
        this._authorities = value;
    }
}
