import {Injectable} from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class DateUtil {
    public static ADD = 'add';
    public static MINUS = 'minus';
    public static DAY = 'day';
    constructor() {
    }

    /**
     * Return hour:minutes from epochDate as string
     * @param {number} epochDate
     * @return {string}
     */
    public static getFormatedTime(epochDate: number): string {
        const utcDate = this.getUTCDate(epochDate);
        return this.addZero(utcDate.getHours()) + ':' + this.addZero(utcDate.getMinutes());
    }

    /**
     * Return UTC epoch time from to inputs: 1) Date without time, 2) Time string with format hh:mm
     * @param {Date} dateObj
     * @param {string} timeString
     * @return {number}
     */
    public static createEpochFromTwoStrings(dateObj: Date, timeString: string): number {
        const timeStr = timeString.toString().split(':');
        return Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), parseInt(timeStr[0], 10), parseInt(timeStr[1], 10), 0);
    }

    /**
     * Return UTC epoch time as number from date input, and date can be modify by optional second parameter which must be in hours
     * @param {Date} dateObj
     * @param {number} modifier
     * @return {number}
     */
    public static getUTCEpoch(dateObj: Date, modifier?: number): number {
        return Number(new Date((dateObj.getTime() + this.modifyHourToMillis(modifier)) + dateObj.getTimezoneOffset() * 60000));
    }

    /**
     * Return UTC Date object from epochDate, and date can be modify by optional second parameter which must be in hours
     * @param {number} epochDate
     * @param {number} modifier
     * @return {Date}
     */
    public static getUTCDate(epochDate: number, modifier?: number): Date {
        const date = new Date(epochDate);
        return new Date((date.getTime() + this.modifyHourToMillis(modifier)) + date.getTimezoneOffset() * 60000);
    }

    /**
     * Return UTC ISO String date from epochaDate, and date can be modify by optional second parameter which must be in hours
     * @param {number} epochDate
     * @param {number} modifier
     * @return {Date}
     */
    public static getStringDate(epochDate: number, modifier?: number): string {
        const date = new Date(epochDate);

        return new Date((date.getTime() + this.modifyHourToMillis(modifier)) + date.getTimezoneOffset() * 60000).toISOString();
    }

    /**
     * Add zero string in time string when the number is less than two digits
     * @param {number} time
     * @return {string}
     */
    private static addZero(time: number): string {
        let stringHour = String(time);

        if (time < 10) {
            stringHour = '0' + time;
        }

        return stringHour;
    }

    /**
     * Convert hours to milliseconds
     * @param {number} hour
     * @return {number}
     */
    private static modifyHourToMillis (hour: number): number {
        return hour !== undefined ? hour * 60 * 60 * 1000 : 0;
    }


    public static formatDate(epochTime: number, format: string): string {
        return moment(epochTime).utc().format(format);
    }

    /**
     * Return the modified time accordingly method arguments
     * @param {number} epochDate
     * @param {number} diff
     * @param {string} scale
     * @param {string} action
     * @returns {number}
     */
    public static changeTime(epochDate: number, diff: number, scale: string, action: string): number {
        const math_operation = {
            'add': (x, y) => x + y,
            'minus': (x, y) => x - y
        };

        const scaleMap = DateUtil.scaleMap();

        return math_operation[action](epochDate, scaleMap.get(scale[diff]));
    }

    /**
     * Create a time scale map
     * @returns {Map}
     */
    private static scaleMap(): Map<string, object> {
        return new Map([
                ['year', (x) => 31536000000 * x ],
                ['month', (x) => 2628000000 * x ],
                ['day', (x) => 86400000 * x ],
                ['hour', (x) => 3600000 * x ],
                ['minute', (x) => 60000 * x ],
                ['second', (x) => 1000 * x ]
            ]);
    }
}
