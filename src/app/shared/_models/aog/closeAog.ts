import {Audit} from '../common/audit';

export class CloseAog {
    private _aogId: number;
    private _observation: string;
    private _audit: Audit;

    private constructor() {
        this._aogId = null;
        this._observation = '';
        this._audit = Audit.getInstance();
    }

    public static getInstance() {
        return new CloseAog();
    }

    get aogId(): number {
        return this._aogId;
    }

    set aogId(value: number) {
        this._aogId = value;
    }

    get observation(): string {
        return this._observation;
    }

    set observation(value: string) {
        this._observation = value;
    }

    get audit(): Audit {
        return this._audit;
    }

    set audit(value: Audit) {
        this._audit = value;
    }
}
