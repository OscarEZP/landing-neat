export class Stage {
    private _revision: number;
    private _idAog: number;
    private _groupId: string;
    private _start: number;
    private _end: number;


    constructor(revision: number, idAog: number, groupId: string, start: number, end: number) {
        this._revision = revision;
        this._idAog = idAog;
        this._groupId = groupId;
        this._start = start;
        this._end = end;
    }

    get revision(): number {
        return this._revision;
    }

    set revision(value: number) {
        this._revision = value;
    }

    get idAog(): number {
        return this._idAog;
    }

    set idAog(value: number) {
        this._idAog = value;
    }

    get groupId(): string {
        return this._groupId;
    }

    set groupId(value: string) {
        this._groupId = value;
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
