import { Injectable } from '@angular/core';

@Injectable()
export class DateUtil {

    constructor() {
    }

    /**
     * Return hour:minutes from epochDate as string
     * @param {number} epochDate
     * @return {string}
     */
    public getFormatedTime(epochDate: number): string {
        const utcDate = this.getUTCDate(epochDate);
        return this.addZero(utcDate.getHours()) + ':' + this.addZero(utcDate.getMinutes());
    }

    /**
     * Return UTC epoch time from to inputs: 1) Date without time, 2) Time string with format hh:mm
     * @param {Date} dateObj
     * @param {string} timeString
     * @return {number}
     */
    public createEpochFromTwoStrings(dateObj: Date, timeString: string): number {
        const timeStr = timeString.toString().split(':');
        return Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), parseInt(timeStr[0], 10), parseInt(timeStr[1], 10), 0);
    }

    /**
     * Return UTC epoch time as number from date input, and date can be modify by optional second parameter which must be in hours
     * @param {Date} epochDate
     * @return {number}
     */
    public getUTCEpoch(dateObj: Date, modifier?: number): number {
        return Number(new Date((dateObj.getTime() + this.modifyHourToMillis(modifier)) + dateObj.getTimezoneOffset() * 60000));
    }

    /**
     * Return UTC Date object from epochDate, and date can be modify by optional second parameter which must be in hours
     * @param {number} epochDate
     * @param {number} modifier
     * @return {Date}
     */
    public getUTCDate(epochDate: number, modifier?: number): Date {
        const date = new Date(epochDate);
        return new Date((date.getTime() + this.modifyHourToMillis(modifier)) + date.getTimezoneOffset() * 60000);
    }

    /**
     * Return UTC ISO String date from epochaDate, and date can be modify by optional second parameter which must be in hours
     * @param {number} epochDate
     * @param {number} modifier
     * @return {Date}
     */
    public getStringDate(epochDate: number, modifier?: number): string {
        const date = new Date(epochDate);
        return new Date((date.getTime() + this.modifyHourToMillis(modifier)) + date.getTimezoneOffset() * 60000).toISOString();
    }

    /**
     * Add zero string in time string when the number is less than two digits
     * @param {number} time
     * @return {string}
     */
    private addZero(time: number): string {
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
    private modifyHourToMillis (hour: number): number {
        return hour !== undefined ? hour * 60 * 60 * 1000 : 0;
    }
}
