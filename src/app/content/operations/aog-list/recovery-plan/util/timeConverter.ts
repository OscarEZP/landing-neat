import {Injectable} from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class TimeConverter {

    constructor() {}

    public static absoluteStartTime(actualTime: number): number {
        return moment(actualTime).subtract(moment(actualTime).get('m')).valueOf();
    }

    public static epochTimeToPixelPosition(selectedTime: number, absoluteStartTime: number, activeViewInHours: number, activeViewInPixels: number): number {
        return Math.round((selectedTime - absoluteStartTime) / TimeConverter.referenceFramePixels(activeViewInHours, activeViewInPixels));
    }

    public static pixelToEpochtimePosition(pixels: number, referenceFrameInPixels: number): number {
        return Math.round(pixels * referenceFrameInPixels * 3600000);
    }

    public static referenceFramePixels(activeViewInHours: number, activeViewInPixels: number): number {
        return Math.round((activeViewInHours * 3600000) / activeViewInPixels);
    }

    public static temporalAddHoursToTime(selectedTime: number, hoursToAdd: number): number {
        return selectedTime + hoursToAdd * 3600000;
    }
}
