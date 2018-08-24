import {Injectable} from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class TimeConverter {

    constructor() {}

    public static absoluteStartTime(actualTime: number): number {
        return moment.utc(actualTime).minute(0).second(0).millisecond(0).valueOf();
    }

    public static epochTimeToPixelPosition(selectedTime: number, absoluteStartTime: number, activeViewInHours: number, activeViewInPixels: number): number {
        return Math.round((selectedTime - absoluteStartTime) / TimeConverter.referenceFramePixels(activeViewInHours, activeViewInPixels));
    }

    public static pixelToEpochtime(pixels: number, referenceFrameInPixels: number): number {
        return Math.round((pixels * 3600000) / referenceFrameInPixels);
    }

    public static referenceFramePixels(activeViewInHours: number, activeViewInPixels: number): number {
        return Math.round((activeViewInHours * 3600000) / activeViewInPixels);
    }
}
