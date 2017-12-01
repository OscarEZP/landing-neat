export class DateModel {

    private _dateStr: string;


    constructor (dateStr: string) {
        this._dateStr = dateStr;
    }

    get dateStr (): string {
        return this._dateStr;
    }

    set dateStr (value: string) {
        this._dateStr = value;
    }
}
