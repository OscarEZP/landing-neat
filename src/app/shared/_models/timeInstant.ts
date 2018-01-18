export class TimeInstant {

    private _epochTime: number;
    private _label: string;

    constructor (epochTime: number, label: string) {
        this._epochTime = epochTime;
        this._label = label;
    }

    get epochTime (): number {
        return this._epochTime;
    }

    set epochTime (value: number) {
        this._epochTime = value;
    }

    get label (): string {
        return this._label;
    }

    set label (value: string) {
        this._label = value;
    }
}

