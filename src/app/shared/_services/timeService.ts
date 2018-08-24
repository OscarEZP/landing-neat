import {Injectable} from '@angular/core';
import {TranslationService} from '../_services/translation.service';

export interface DurationInterface {
    duration: number;
    label: string;
}

@Injectable()
export class TimeService {

    /**
     * Get an Array with intervals of minutes until limit
     * @returns {number[]}
     */
    static getIntervals(interval: number, limit: number): number[] {
        const res = [];
        for (let i = 1; i * interval <= limit; i++) {
            res.push(i * interval);
        }
        return res;
    }

    private static MINUTE_ABBREVIATION = 'FORM.MINUTE_ABBREVIATION';
    private static HOUR_ABBREVIATION = 'FORM.HOUR_ABBREVIATION';
    private static HOUR_LABEL = 'FORM.HOUR';
    private static HOURS_LABEL = 'FORM.HOURS';
    private static MINUTES_LABEL = 'FORM.MINUTES';

    private _hourLabel: string;
    private _hoursLabel: string;
    private _minuteAbbreviation: string;
    private _hourAbbreviation: string;
    private _minutesLabel: string;

    constructor(
        private _translationService: TranslationService
    ) {
        this._translationService.translate(TimeService.MINUTE_ABBREVIATION).then(res => this._minuteAbbreviation = res);
        this._translationService.translate(TimeService.HOUR_ABBREVIATION).then(res => this._hourAbbreviation = res);
        this._translationService.translate(TimeService.HOURS_LABEL).then(res => this._hoursLabel = res);
        this._translationService.translate(TimeService.HOUR_LABEL).then(res => this._hourLabel = res);
        this._translationService.translate(TimeService.MINUTES_LABEL).then(res => this._minutesLabel = res);
    }

    /**
     * Get a DurationInterface array with duration and label
     * @param {number} interval
     * @param {number} limit
     * @returns {string[]}
     */
    public getDurationIntervals(interval: number, limit: number): DurationInterface[] {
        return TimeService
            .getIntervals(interval, limit)
            .map(v => ({ label: this.getDurationLabel(v), duration: v }));
    }



    /**
     * Get a label with hours and minutes abbreviation
     * @param {number} duration
     * @returns {string}
     */
    public getDurationLabel(duration: number): string {
        const minToHour = 60;
        const durationToHours = duration / minToHour;
        const hours = Math.floor(durationToHours);
        if (duration >= minToHour) {
            return durationToHours === hours ?
                hours.toString().concat(' ').concat(hours > 1 ? this.hoursLabel : this.hourLabel) :
                hours.toString().concat(this.hourAbbreviation)
                    .concat(' ')
                    .concat((duration - (hours * minToHour)).toString())
                    .concat(this.minuteAbbreviation);
        } else {
            return duration.toString().concat(' ').concat(this.minutesLabel);
        }
    }

    get hourLabel(): string {
        return this._hourLabel;
    }

    get hoursLabel(): string {
        return this._hoursLabel;
    }

    get minuteAbbreviation(): string {
        return this._minuteAbbreviation;
    }

    get hourAbbreviation(): string {
        return this._hourAbbreviation;
    }

    get minutesLabel(): string {
        return this._minutesLabel;
    }
}
