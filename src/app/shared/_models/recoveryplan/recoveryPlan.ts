import {Stage} from './stage';
import {DateRange} from '../common/dateRange';
import {Audit} from '../common/audit';

export class RecoveryPlan {

    private _aogSeq: number;
    private _revision: number; // la revisón tampoco se manda, la calcula el back
    private _stages: Stage[];
    private _range: DateRange; // Solo para get, en save no se manda
    private _audit: Audit;
    private _enable: boolean; // para save siempre en true


    constructor(aogSeq: number, revision: number, stages: Stage[], range: DateRange, audit: Audit, enable: boolean) {
        this._aogSeq = aogSeq;
        this._revision = revision;
        this._stages = stages;
        this._range = range;
        this._audit = audit;
        this._enable = enable;
    }

    public static getInstance(): RecoveryPlan {
        return new RecoveryPlan(null, null, [], DateRange.getInstance(), Audit.getInstance(), null);
    }

    get aogSeq(): number {
        return this._aogSeq;
    }

    set aogSeq(value: number) {
        this._aogSeq = value;
    }

    get revision(): number {
        return this._revision;
    }

    set revision(value: number) {
        this._revision = value;
    }

    get stages(): Stage[] {
        return this._stages;
    }

    set stages(value: Stage[]) {
        this._stages = value;
    }

    get range(): DateRange {
        return this._range;
    }

    set range(value: DateRange) {
        this._range = value;
    }

    get audit(): Audit {
        return this._audit;
    }

    set audit(value: Audit) {
        this._audit = value;
    }

    get enable(): boolean {
        return this._enable;
    }

    set enable(value: boolean) {
        this._enable = value;
    }
}
