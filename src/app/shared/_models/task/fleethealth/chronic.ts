export class Chronic {

    private _hasChronic: boolean;
    private _description: string;

    private constructor(description: string, hasChronic: boolean) {
        this._description = description;
        this._hasChronic = hasChronic;
    }

    static getInstance(): Chronic {
        return new Chronic(null, true);
    }

    get hasChronic(): boolean {
        return this._hasChronic;
    }

    set hasChronic(value: boolean) {
        this._hasChronic = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }
}
