export class Aircraft {

    private _tail: string;
    private _fleet: string;
    private _operator: string;


    constructor(tail: string, fleet: string, operator: string) {
        this._tail = tail;
        this._fleet = fleet;
        this._operator = operator;
    }


    get tail(): string {
        return this._tail;
    }

    set tail(value: string) {
        this._tail = value;
    }

    get fleet(): string {
        return this._fleet;
    }

    set fleet(value: string) {
        this._fleet = value;
    }

    get operator(): string {
        return this._operator;
    }

    set operator(value: string) {
        this._operator = value;
    }
}
