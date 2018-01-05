import { Aircraft } from './aircraft';
import { Backup } from './backup';
import { Flight } from './flight';
import { Safety } from './safety';
import { Status } from './status';
import { TimeInstant } from './timeInstant';
import {Close} from './close';

export class Contingency {

    private _id: number;
    private _aircraft: Aircraft;
    private _barcode: string;
    private _creationDate: TimeInstant;
    private _close: Close;
    private _lastInformationPercentage: number;
    private _failure: string;
    private _flight: Flight;
    private _informer: string;
    private _isBackup: boolean;
    private _backup: Backup;
    private _reason: string;
    private _safetyEvent: Safety;
    private _status: Status;
    private _type: string;
    private _username: string;

    constructor (id: number, aircraft: Aircraft, barcode: string, creationDate: TimeInstant, failure: string, flight: Flight, informer: string, isBackup: boolean, backup: Backup, reason: string, safetyEvent: Safety, status: Status, type: string, username: string) {
        this._id = id;
        this._aircraft = aircraft;
        this._barcode = barcode;
        this._creationDate = creationDate;
        this._failure = failure;
        this._flight = flight;
        this._informer = informer;
        this._isBackup = isBackup;
        this._backup = backup;
        this._reason = reason;
        this._safetyEvent = safetyEvent;
        this._status = status;
        this._type = type;
        this._username = username;
    }

    set lastInformationPercentage (value: number) {
        this._lastInformationPercentage = value;
    }

    get lastInformationPercentage (): number {
        return this._lastInformationPercentage;
    }

    get id (): number {
        return this._id;
    }

    set id (value: number) {
        this._id = value;
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

    get creationDate (): TimeInstant {
        return this._creationDate;
    }

    set creationDate (value: TimeInstant) {
        this._creationDate = value;
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

    get username (): string {
        return this._username;
    }

    set username (value: string) {
        this._username = value;
    }

    get close(): Close {
        return this._close;
    }

    set close(value: Close) {
        this._close = value;
    }

    get backup(): Backup {
        return this._backup;
    }

    set backup(value: Backup) {
        this._backup = value;
    }

    static fromJsonArray(array: Array<Object>): Contingency[] {
        return array.map(obj => new Contingency(obj['id'], obj['aircraft'], obj['barcode'], obj['creationDate'], obj['failure'], obj['flight'], obj['informer'], obj['isBackup'], obj['backup'], obj['reason'], obj['safetyEvent'], obj['status'], obj['type'], obj['username']));
    }
}
