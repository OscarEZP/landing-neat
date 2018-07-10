import {TimeInstant} from '../timeInstant';
import {StatusAog} from './statusAog';
export class Aog {

    private _tail: string;
    private _fleet: string;
    private _operator: string;
    private _barcode: string;
    private _station: string;
    private _safety: string;
    private _maintenance: string;
    private _failure: string;
    private _reason: string;
    private _status: string;
    private _isSafetyEvent: boolean;
    private _openAogDate: TimeInstant;
    private _durationAog: string;
    private _openStatusDate: TimeInstant;
    private _durationStatus: number;
    private _status: StatusAog;
    private _username: string;
    private _creationDate: TimeInstant;

    private constructor() {

    this.tail = '';
    this.fleet = '';
    this.operator = '';
    this.barcode = '';
    this.station = '';
    this.safety = '';
    this.maintenance = '';
    this.failure = '';
    this.reason = '';
    this.status = StatusAog.getInstance();
    this.username = '';
    this.creationDate = TimeInstant.getInstance();

    }

    public static getInstance() {
        return new Aog();
    }

    constructor() {
        this._tail = '';
        this._fleet = '';
        this._operator = '';
        this._barcode = '';
        this._reason = '';
        this._status = '';
        this._isSafetyEvent = false;
        this._openAogDate = TimeInstant.getInstance();
        this._durationAog = '00:00';
        this._openStatusDate = TimeInstant.getInstance();
        this._durationStatus = 0;
    }

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

    get station(): string {
        return this._station;
    }

    set station(value: string) {
        this._station = value;
    }

    get safety(): string {
        return this._safety;
    }

    set safety(value: string) {
        this._safety = value;
    }

    get maintenance(): string {
        return this._maintenance;
    }

    set maintenance(value: string) {
        this._maintenance = value;
    }

    get failure(): string {
        return this._failure;
    }

    set failure(value: string) {
        this._failure = value;
    }

    get reason(): string {
        return this._reason;
    }

    set reason(value: string) {
        this._reason = value;
    }

    get status(): StatusAog {
        return this._status;
    }

    set status(value: StatusAog) {
        this._status = value;
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

    get creationDate(): TimeInstant {
        return this._creationDate;
    }

    set creationDate(value: TimeInstant) {
        this._creationDate = value;
    }
}
