import {TimeInstant} from '../timeInstant';
import {EvaluationCategory} from './fleethealth/evaluationCategory';
import {Review} from './analysis/review';

export class Task {
    private _ata: string;
    private _barcode: string;
    private _clazz: string;
    private _createDate: TimeInstant;
    private _deferralClazz: string;
    private _deferralReference: string;
    private _faultName: string;
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
    private _isClose: boolean;
    private _isOpen: boolean;
    private _evaluationCategory: EvaluationCategory;
    private _review: Review;
    private _taskType: string;
    private _authority: string;
    private _hasHistorical: boolean;

    private constructor() {
        this.id = null;
        this.tail = '';
        this.fleet = '';
        this.barcode = '';
        this.source = '';
        this.description = '';
        this.clazz = '';
        this.status = '';
        this.estimatedDuration = 0;
        this.createDate = TimeInstant.getInstance();
        this.ata = '';
        this.dueDate = TimeInstant.getInstance();
        this.extendedDueDate = TimeInstant.getInstance();
        this.finalDueDate = TimeInstant.getInstance();
        this.finishEvaluation = false;
        this.deferralReference = '';
        this.deferralClazz = '';
        this.timelineStatus = '';
        this.revisionDate = TimeInstant.getInstance();
        this.isClose = false;
        this.isOpen = false;
        this.evaluationCategory = EvaluationCategory.getInstance();
        this.review = Review.getInstance();
        this.taskType = '';
        this.authority = '';
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

    get isClose(): boolean {
        return this._isClose;
    }

    set isClose(value: boolean) {
        this._isClose = value;
    }

    get isOpen(): boolean {
        return this._isOpen;
    }

    set isOpen(value: boolean) {
        this._isOpen = value;
    }

    get createEpochTime(): number {
        return this.createDate.epochTime;
    }

    get extendedEpochTime(): number {
        return this.extendedDueDate.epochTime;
    }

    get dueDateEpochTime(): number {
        return this.dueDate.epochTime;
    }

    get evaluationCategory(): EvaluationCategory {
        return this._evaluationCategory;
    }

    set evaluationCategory(value: EvaluationCategory) {
        this._evaluationCategory = value;
    }

    get review(): Review {
        return this._review;
    }

    set review(value: Review) {
        this._review = value;
    }

    get alertCode(): string {
        return this.evaluationCategory.alertCode;
    }

    get taskType(): string {
        return this._taskType;
    }

    set taskType(value: string) {
        this._taskType = value;
    }

    get authority(): string {
        return this._authority;
    }

    set authority(value: string) {
        this._authority = value;
    }

    get faultName(): string {
        return this._faultName;
    }

    set faultName(value: string) {
        this._faultName = value;
    }

    get hasHistorical(): boolean {
        return this._hasHistorical;
    }

    set hasHistorical(value: boolean) {
        this._hasHistorical = value;
    }
}
