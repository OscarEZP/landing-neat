export class DateModel {

    private _date: number;


    constructor (date: number) {
        this._date = date;
    }

    get date (): number {
        return this._date;
    }

    set date (value: number) {
        this._date = value;
    }
}
