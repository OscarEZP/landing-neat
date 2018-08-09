import {Injectable} from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class TimeConverterService {

    constructor() {}

    public static absoluteStartTime(actualTime: number): number {
        return moment(actualTime).subtract(moment.unix(actualTime).get('m')).valueOf();
    }

    public static epochTimeToPixelPosition(selectedTime: number, absoluteStartTime: number, activeViewInHours: number, activeViewInPixels: number): number {
        return Math.round((selectedTime - absoluteStartTime) / TimeConverterService.referenceFramePixels(activeViewInHours, activeViewInPixels));
    }

    public static pixelToEpochtimePosition(actualPosition: number, startTime: number, referenceFrameInPixels: number): number {
        return Math.round(actualPosition * referenceFrameInPixels * 3600);
    }

    public static referenceFramePixels(activeViewInHours: number, activeViewInPixels: number): number {
        return Math.round((activeViewInHours * 3600) / activeViewInPixels);
    }

    public static temporalAddHoursToTime(selectedTime: number, hoursToAdd: number) {
        return selectedTime + hoursToAdd * 3600;
    }
}
