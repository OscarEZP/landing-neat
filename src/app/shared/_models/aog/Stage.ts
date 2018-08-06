export class Stage {
    private _revision: number;
    private _id_aog: number;
    private _group_id: string;
    private _start: number;
    private _end: number;


    constructor(revision: number, id_aog: number, group_id: string, start: number, end: number) {
        this._revision = revision;
        this._id_aog = id_aog;
        this._group_id = group_id;
        this._start = start;
        this._end = end;
    }

    get revision(): number {
        return this._revision;
    }

    set revision(value: number) {
        this._revision = value;
    }

    get id_aog(): number {
        return this._id_aog;
    }

    set id_aog(value: number) {
        this._id_aog = value;
    }

    get group_id(): string {
        return this._group_id;
    }

    set group_id(value: string) {
        this._group_id = value;
    }

    get start(): number {
        return this._start;
    }

    set start(value: number) {
        this._start = value;
    }

    get end(): number {
        return this._end;
    }

    set end(value: number) {
        this._end = value;
    }
}