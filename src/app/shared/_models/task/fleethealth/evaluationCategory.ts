export class EvaluationCategory {

    private _displayAlert: string;
    private _outOfStandard: boolean;
    private _partReplacement: boolean;
    private _complexLimops: boolean;
    private _alertCode: string;

    constructor(displayAlert: string, outOfStandard: boolean, partReplacement: boolean, complexLimops: boolean, alertCode: string) {
        this._displayAlert = displayAlert;
        this._outOfStandard = outOfStandard;
        this._partReplacement = partReplacement;
        this._complexLimops = complexLimops;
        this._alertCode = alertCode;
    }

    static getInstance(): EvaluationCategory {
        return new EvaluationCategory(null, null, null, null, null);
    }


    get displayAlert(): string {
        return this._displayAlert;
    }

    set displayAlert(value: string) {
        this._displayAlert = value;
    }

    get outOfStandard(): boolean {
        return this._outOfStandard;
    }

    set outOfStandard(value: boolean) {
        this._outOfStandard = value;
    }

    get partReplacement(): boolean {
        return this._partReplacement;
    }

    set partReplacement(value: boolean) {
        this._partReplacement = value;
    }

    get complexLimops(): boolean {
        return this._complexLimops;
    }

    set complexLimops(value: boolean) {
        this._complexLimops = value;
    }

    get alertCode(): string {
        return this._alertCode;
    }

    set alertCode(value: string) {
        this._alertCode = value;
    }
}
