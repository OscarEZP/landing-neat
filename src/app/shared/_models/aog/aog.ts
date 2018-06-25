import {TimeInstant} from '../timeInstant';
export class Aog {

    private _tail: string;
    private _fleet: string;
    private _operator: string;
    private _barcode: string;
    private _reason: string;
    private _status: string;
    private _isSafetyEvent: boolean;
    private _openAogDate: TimeInstant;
    private _durationAog: number;
    private _openStatusDate: TimeInstant;
    private _durationStatus: number;

    get tail(): string {
        return this._tail;
    }

    set tail(value: string) {
        this._tail = value;
    }

    get fleet(): string {
        return this._fleet;
    }

    set fleet(value: string) {
        this._fleet = value;
    }

    get operator(): string {
        return this._operator;
    }

    set operator(value: string) {
        this._operator = value;
    }

    get barcode(): string {
        return this._barcode;
    }

    set barcode(value: string) {
        this._barcode = value;
    }

    get reason(): string {
        return this._reason;
    }

    set reason(value: string) {
        this._reason = value;
    }

    get status(): string {
        return this._status;
    }

    set status(value: string) {
        this._status = value;
    }

    get isSafetyEvent(): boolean {
        return this._isSafetyEvent;
    }

    set isSafetyEvent(value: boolean) {
        this._isSafetyEvent = value;
    }

    get openAogDate(): TimeInstant {
        return this._openAogDate;
    }

    set openAogDate(value: TimeInstant) {
        this._openAogDate = value;
    }

    get durationAog(): number {
        return this._durationAog;
    }

    set durationAog(value: number) {
        this._durationAog = value;
    }

    get openStatusDate(): TimeInstant {
        return this._openStatusDate;
    }

    set openStatusDate(value: TimeInstant) {
        this._openStatusDate = value;
    }

    get durationStatus(): number {
        return this._durationStatus;
    }

    set durationStatus(value: number) {
        this._durationStatus = value;
    }
}
