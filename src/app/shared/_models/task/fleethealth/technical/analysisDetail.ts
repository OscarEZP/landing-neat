export class AnalysisDetail {

    private _deferral: string;
    private _days: number;

   private constructor(deferral: string, days: number) {
        this._days = days;
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

    get days(): number {
        return this._days;
    }

    set days(value: number) {
        this._days = value;
    }
}
