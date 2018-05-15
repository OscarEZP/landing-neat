import {AnalysisDetail} from './analysisDetail';
import {Audit} from '../../../common/audit';

export class TechnicalAnalysis {

    private _station: string;
    private _authority: string;
    private _detail: AnalysisDetail[];
    private _audit: Audit;
    private _isDefault: boolean;

    public constructor(station: string = '', authority: string = '', detail: AnalysisDetail[] = [], audit: Audit = Audit.getInstance(), isDefault: boolean = false) {
        this._station = station;
        this._authority = authority;
        this._detail = detail;
        this._audit = audit;
        this._isDefault = isDefault;
    }

    static getInstance(): TechnicalAnalysis {
        return new TechnicalAnalysis(null, null, [], Audit.getInstance(), true);
    }
    get station(): string {
        return this._station;
    }

    set station(value: string) {
        this._station = value;
    }

    get authority(): string {
        return this._authority;
    }

    set authority(value: string) {
        this._authority = value;
    }

    get detail(): AnalysisDetail[] {
        return this._detail;
    }

    set detail(value: AnalysisDetail[]) {
        this._detail = value;
    }

    get audit(): Audit {
        return this._audit;
    }

    set audit(value: Audit) {
        this._audit = value;
    }

    get isDefault(): boolean {
        return this._isDefault;
    }

    set isDefault(value: boolean) {
        this._isDefault = value;
    }
}
