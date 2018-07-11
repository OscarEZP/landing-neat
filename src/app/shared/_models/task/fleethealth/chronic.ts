export class Chronic {

    private _hasNotAnalyzedYet: boolean;
    private _hasChronic: boolean;
    private _description: string;

    private constructor(description: string, hasChronic: boolean, hastNotAnalizedYet: boolean) {
        this._description = this._description;
        this._hasChronic = this._hasChronic;
        this._hasNotAnalyzedYet = this._hasNotAnalyzedYet;
    }

    static getInstance(): Chronic {
        return new Chronic(null, true, true);
    }

    get hasNotAnalyzedYet(): boolean {
        return this._hasNotAnalyzedYet;
    }

    set hasNotAnalyzedYet(value: boolean) {
        this._hasNotAnalyzedYet = value;
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
