import {Audit} from './audit';

export class Reason {
    private _id: number;
    private _description: string;
    private _audit: Audit;

    private constructor(id: number, description: string, audit: Audit) {
        this._id = id;
        this._description = description;
        this._audit = audit;
    }

    static getInstance(): Reason {
        return new Reason(null, null, Audit.getInstance());
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get audit(): Audit {
        return this._audit;
    }

    set audit(value: Audit) {
        this._audit = value;
    }
}
