import { Aircraft } from './aircraft';
import { Flight } from './flight';
import { Safety } from './safety';
import { Status } from './status';

export class Contingency {

    private _aircraft: Aircraft;
    private _barcode: string;
    private _etd: number;
    private _failure: string;
    private _flight: Flight;
    private _informer: string;
    private _isBackup: boolean;
    private _reason: string;
    private _safetyEvent: Safety;
    private _status: Status;
    private _type: string;

    constructor (aircraft: Aircraft, barcode: string, etd: number, failure: string, flight: Flight, informer: string, isBackup: boolean, reason: string, safetyEvent: Safety, status: Status, type: string) {
        this._aircraft = aircraft;
        this._barcode = barcode;
        this._etd = etd;
        this._failure = failure;
        this._flight = flight;
        this._informer = informer;
        this._isBackup = isBackup;
        this._reason = reason;
        this._safetyEvent = safetyEvent;
        this._status = status;
        this._type = type;
    }


    get aircraft (): Aircraft {
        return this._aircraft;
    }

    set aircraft (value: Aircraft) {
        this._aircraft = value;
    }

    get barcode (): string {
        return this._barcode;
    }

    set barcode (value: string) {
        this._barcode = value;
    }

    get etd (): number {
        return this._etd;
    }

    set etd (value: number) {
        this._etd = value;
    }

    get failure (): string {
        return this._failure;
    }

    set failure (value: string) {
        this._failure = value;
    }

    get flight (): Flight {
        return this._flight;
    }

    set flight (value: Flight) {
        this._flight = value;
    }

    get informer (): string {
        return this._informer;
    }

    set informer (value: string) {
        this._informer = value;
    }

    get isBackup (): boolean {
        return this._isBackup;
    }

    set isBackup (value: boolean) {
        this._isBackup = value;
    }

    get reason (): string {
        return this._reason;
    }

    set reason (value: string) {
        this._reason = value;
    }

    get safetyEvent (): Safety {
        return this._safetyEvent;
    }

    set safetyEvent (value: Safety) {
        this._safetyEvent = value;
    }

    get status (): Status {
        return this._status;
    }

    set status (value: Status) {
        this._status = value;
    }

    get type (): string {
        return this._type;
    }

    set type (value: string) {
        this._type = value;
    }
}
