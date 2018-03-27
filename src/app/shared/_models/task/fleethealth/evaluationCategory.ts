export class EvaluationCategory {

    private _displayAlert: string;
    private _outOfStandard: boolean;
    private _partReplacement: boolean;
    private _complexLimops: boolean;

    constructor(displayAlert: string, outOfStandard: boolean, partReplacement: boolean, complexLimops: boolean) {
        this._displayAlert = displayAlert;
        this._outOfStandard = outOfStandard;
        this._partReplacement = partReplacement;
        this._complexLimops = complexLimops

    }

    static getInstance(): EvaluationCategory {
        return new EvaluationCategory(null, null, null, null);
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
}
