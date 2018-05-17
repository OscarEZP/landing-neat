export class AnalysisDetail {

    private _deferral: string;
    private _day: number;

   private constructor(deferral: string, day: number) {
        this._day = day;
        this._deferral = deferral;
    }

    static getInstance(): AnalysisDetail {
        return new AnalysisDetail(null, null);
    }

    get deferral(): string {
        return this._deferral;
    }

    set deferral(value: string) {
        this._deferral = value;
    }

    get day(): number {
        return this._day;
    }

    set day(value: number) {
        this._day = value;
    }
}
