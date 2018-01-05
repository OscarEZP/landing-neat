import { DateUtil } from '../../util/dateUtil';

export class DateModel {

    private _dateString: string;
    private _timeString: string;
    private _dateObj: Date;
    private _epochTime: number;
    private _dateUtil: DateUtil;

    constructor(epochDate: number, modifier?: number) {
        this.dateUtil = new DateUtil();
        this.updateFromEpoch(epochDate, modifier);
    }

    get dateString(): string {
        return this._dateString;
    }

    set dateString(value: string) {
        this._dateString = value;
    }

    get timeString(): string {
        return this._timeString;
    }

    set timeString(value: string) {
        this._timeString = value;
    }

    get dateObj(): Date {
        return this._dateObj;
    }

    set dateObj(value: Date) {
        this._dateObj = value;
    }

    get epochTime(): number {
        return this._epochTime;
    }

    set epochTime(value: number) {
        this._epochTime = value;
    }

    get dateUtil(): DateUtil {
        return this._dateUtil;
    }

    set dateUtil(value: DateUtil) {
        this._dateUtil = value;
    }

    /**
     * Method to update values of the instance from epoch value
     * @param {number} epochDate
     * @param {number} modifier
     */
    public updateFromEpoch(epochDate: number, modifier?: number): void {
        const isEpochValid = epochDate !== null && epochDate !== undefined;
        this.dateString = isEpochValid ? this.dateUtil.getStringDate(epochDate, modifier) : '';
        this.timeString = isEpochValid ? this.dateUtil.getFormatedTime(epochDate) : '';
        this.dateObj = isEpochValid ? this.dateUtil.getUTCDate(epochDate, modifier) : null;
        this.epochTime = isEpochValid ? this.dateUtil.getUTCEpoch(this.dateObj, modifier) : 0;
    }
}
