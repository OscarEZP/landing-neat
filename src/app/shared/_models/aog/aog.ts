import {StatusAog} from './statusAog';
import {Audit} from '../common/audit';

export class Aog {
    private _id: number;
    private _tail: string;
    private _fleet: string;
    private _operator: string;
    private _barcode: string;
    private _station: string;
    private _safety: string;
    private _maintenance: string;
    private _failure: string;
    private _reason: string;
    private _status: StatusAog;
    private _audit: Audit;

    private constructor() {
        this._id = null;
        this._tail = '';
        this._fleet = '';
        this._operator = '';
        this._station = '';
        this._barcode = '';
        this._safety = '';
        this._maintenance = '';
        this._failure = '';
        this._reason = '';
        this._status = StatusAog.getInstance();
        this._audit = Audit.getInstance();
    }

    public static getInstance() {
        return new Aog();
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

    get durationAog(): number {
        return this.status.requestedInterval.duration;
    }

    set durationAog(value: number) {
        this.status.requestedInterval.duration = value;
    }

    get observation(): string {
        return this.status.observation;
    }

    set observation(value: string) {
        this.status.observation = value;
    }

    get code(): string {
        return this.status.code;
    }

    set code(value: string) {
        this.status.code = value;
    }

    get audit(): Audit {
        return this._audit;
    }

    set audit(value: Audit) {
        this._audit = value;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }
}
