export class StatusSearch {

    private _aogId: number;

    private constructor(aogId: number) {
        this._aogId = aogId;

    }

    static getInstance(): StatusSearch {
        return new StatusSearch(null);
    }

    get aogId(): number {
        return this._aogId;
    }

    set aogId(value: number) {
        this._aogId = value;
    }
}
