import { Activity } from './activity';
import { Assistant } from './assistant';
import { TimeInstant } from '../timeInstant';
import { Pending } from './pending';
import { Agreement } from "./agreement";

export class Meeting {
    private _id: number;
    private _contingencyId: number;
    private _activities: Activity[];
    private _barcode: string;
    private _createUser: string;
    private _timeInstant: TimeInstant;
    private _safetyCode: string;
    private _assistants: Assistant[];
    private _pendings: Pending[];
    private _performedActivities:string;
    private _agreements: Array<Agreement>;

    constructor( contingencyId: number) {

        this.contingencyId = contingencyId;
        this.activities = [];
        this.barcode = null;
        this.createUser = null;
        this.timeInstant = TimeInstant.getInstance();
        this.safetyCode = null;
        this.assistants = [];
        this.pendings = [];
        this.performedActivities=null;
        this.agreements=[];
    }
    static getInstance(): Meeting {
        return new Meeting(null);
    }

    get safetyCode(): string {
        return this._safetyCode;
    }

    set safetyCode(value: string) {
        this._safetyCode = value;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get contingencyId(): number {
        return this._contingencyId;
    }

    set contingencyId(value: number) {
        this._contingencyId = value;
    }

    get activities(): Array<Activity> {
        return this._activities;
    }

    set activities(value: Array<Activity>) {
        this._activities = value;
    }

    get barcode(): string {
        return this._barcode;
    }

    set barcode(value: string) {
        this._barcode = value;
    }

    get createUser(): string {
        return this._createUser;
    }

    set createUser(value: string) {
        this._createUser = value;
    }

    get timeInstant(): TimeInstant {
        return this._timeInstant;
    }

    set timeInstant(value: TimeInstant) {
        this._timeInstant = value;
    }

    get assistants(): Array<Assistant> {
        return this._assistants;
    }

    set assistants(value: Array<Assistant>) {
        this._assistants = value;
    }

    get pendings(): Pending[] {
        return this._pendings;
    }

    set pendings(value: Pending[]) {
        this._pendings = value;
    }
    get performedActivities(): string {
        return this._performedActivities;
    }

    set performedActivities(value: string) {
        this._performedActivities = value;
    }
    get agreements(): Array<Agreement> {
        return this._agreements;
    }

    set agreements(value: Array<Agreement>) {
        this._agreements = value;
    }
}
