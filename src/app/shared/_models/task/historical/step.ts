import {TimeInstant} from '../../timeInstant';
import {StepLabour} from './stepLabour';


export class Step {
    private _barcode: string;
    private _id: number;
    private _ord: number;
    private _status: string;
    private _description: string;
    private _createDate: TimeInstant;
    private _reviseDate: TimeInstant;
    private _stepLabours: StepLabour[];

    private constructor() {
        this._barcode = '';
        this._id = null;
        this._ord = null;
        this._status = '';
        this._description = '';
        this._createDate = TimeInstant.getInstance();
        this._reviseDate = TimeInstant.getInstance();
        this._stepLabours = [];

    }

    public static getInstance() {
        return new Step();
    }


    get barcode(): string {
        return this._barcode;
    }

    set barcode(value: string) {
        this._barcode = value;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get ord(): number {
        return this._ord;
    }

    set ord(value: number) {
        this._ord = value;
    }

    get status(): string {
        return this._status;
    }

    set status(value: string) {
        this._status = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get createDate(): TimeInstant {
        return this._createDate;
    }

    set createDate(value: TimeInstant) {
        this._createDate = value;
    }

    get reviseDate(): TimeInstant {
        return this._reviseDate;
    }

    set reviseDate(value: TimeInstant) {
        this._reviseDate = value;
    }

    get stepLabours(): StepLabour[] {
        return this._stepLabours;
    }

    set stepLabours(value: StepLabour[]) {
        this._stepLabours = value;
    }
}
