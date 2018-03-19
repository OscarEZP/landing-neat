import {TimeInstant} from '../timeInstant';

export class Task {
    private _ata: string;
    private _barcode: string;
    private _clazz: string;
    private _createDate: TimeInstant;
    private _creationDate: TimeInstant;
    private _deferralClazz: string;
    private _deferralReference: string;
    private _description: string;
    private _dueDate: TimeInstant;
    private _estimatedDuration: number;
    private _extendedDueDate: TimeInstant;
    private _finalDueDate: TimeInstant;
    private _finishEvaluation: boolean;
    private _fleet: string;
    private _id: number;
    private _source: string;
    private _status: string;
    private _tail: string;
    private _timelineStatus: string;
    private _revisionDate: TimeInstant;


    constructor() {
        this._id = null;
        this._tail = '';
        this._fleet = '';
        this._barcode = '';
        this._source = '';
        this._description = '';
        this._clazz = '';
        this._status = '';
        this._estimatedDuration = 0;
        this._createDate = TimeInstant.getInstance();
        this._ata = '';
        this._dueDate = TimeInstant.getInstance();
        this._extendedDueDate = TimeInstant.getInstance();
        this._finalDueDate = TimeInstant.getInstance();
        this._finishEvaluation = false;
        this._deferralReference = '';
        this._deferralClazz = '';
        this._creationDate = TimeInstant.getInstance();
        this._timelineStatus = '';
        this._revisionDate = TimeInstant.getInstance();
    }

    public static getInstance() {
        return new Task();
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

    get barcode(): string {
        return this._barcode;
    }

    set barcode(value: string) {
        this._barcode = value;
    }

    get source(): string {
        return this._source;
    }

    set source(value: string) {
        this._source = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get clazz(): string {
        return this._clazz;
    }

    set clazz(value: string) {
        this._clazz = value;
    }

    get status(): string {
        return this._status;
    }

    set status(value: string) {
        this._status = value;
    }

    get estimatedDuration(): number {
        return this._estimatedDuration;
    }

    set estimatedDuration(value: number) {
        this._estimatedDuration = value;
    }

    get createDate(): TimeInstant {
        return this._createDate;
    }

    set createDate(value: TimeInstant) {
        this._createDate = value;
    }

    get ata(): string {
        return this._ata;
    }

    set ata(value: string) {
        this._ata = value;
    }

    get dueDate(): TimeInstant {
        return this._dueDate;
    }

    set dueDate(value: TimeInstant) {
        this._dueDate = value;
    }

    get extendedDueDate(): TimeInstant {
        return this._extendedDueDate;
    }

    set extendedDueDate(value: TimeInstant) {
        this._extendedDueDate = value;
    }

    get finalDueDate(): TimeInstant {
        return this._finalDueDate;
    }

    set finalDueDate(value: TimeInstant) {
        this._finalDueDate = value;
    }

    get finishEvaluation(): boolean {
        return this._finishEvaluation;
    }

    set finishEvaluation(value: boolean) {
        this._finishEvaluation = value;
    }

    get deferralReference(): string {
        return this._deferralReference;
    }

    set deferralReference(value: string) {
        this._deferralReference = value;
    }

    get deferralClazz(): string {
        return this._deferralClazz;
    }

    set deferralClazz(value: string) {
        this._deferralClazz = value;
    }

    get creationDate(): TimeInstant {
        return this._creationDate;
    }

    set creationDate(value: TimeInstant) {
        this._creationDate = value;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get timelineStatus(): string {
        return this._timelineStatus;
    }

    set timelineStatus(value: string) {
        this._timelineStatus = value;
    }


    get revisionDate(): TimeInstant {
        return this._revisionDate;
    }

    set revisionDate(value: TimeInstant) {
        this._revisionDate = value;
    }
}
