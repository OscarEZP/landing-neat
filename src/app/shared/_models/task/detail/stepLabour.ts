import {TimeInstant} from '../../timeInstant';
import {Name} from '../../common/name';


export class StepLabour {
    private _labourId: number;
    private _name: Name;
    private _notes: string;
    private _createDate: TimeInstant;
    private _reviseDate: TimeInstant;


    private constructor() {
        this._labourId = null;
        this._name = Name.getInstance();
        this._notes = '';
        this._createDate = TimeInstant.getInstance();
        this._reviseDate = TimeInstant.getInstance();
    }

    public static getInstance() {
        return new StepLabour();
    }


    get labourId(): number {
        return this._labourId;
    }

    set labourId(value: number) {
        this._labourId = value;
    }

    get name(): Name {
        return this._name;
    }

    set name(value: Name) {
        this._name = value;
    }

    get notes(): string {
        return this._notes;
    }

    set notes(value: string) {
        this._notes = value;
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
}
