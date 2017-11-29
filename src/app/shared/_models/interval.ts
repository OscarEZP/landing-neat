import { DateModel } from './dateModel';

export class Interval {

    private _duration: number;
    private _date: DateModel;


    constructor (duration: number, date: DateModel) {
        this._duration = duration;
        this._date = date;
    }

    get duration (): number {
        return this._duration;
    }

    set duration (value: number) {
        this._duration = value;
    }

    get date (): DateModel {
        return this._date;
    }

    set date (value: DateModel) {
        this._date = value;
    }
}
