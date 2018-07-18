import {TimeInstant} from '../../timeInstant';
import {CorrectiveAction} from '../detail/correctiveAction';
import {Step} from '../detail/step';
import {Part} from '../detail/part';

export class DetailTask {


    private _barcode: string;
    private _ata: string;
    private _creationDate: TimeInstant;
    private _description: string;
    private _faultName: string;
    private _correctiveActions: CorrectiveAction[];
    private _steps: Step[];
    private _parts: Part[];
    private _report: string;


   private constructor() {
        this._ata = '';
        this._barcode = '';
        this._description = '';
        this._correctiveActions = [];
        this._steps = [];
        this._creationDate = TimeInstant.getInstance();
        this._faultName = '';
        this._parts = [];
        this._report = '';

    }

    public static getInstance() {
        return new DetailTask();
    }


    get barcode(): string {
        return this._barcode;
    }

    set barcode(value: string) {
        this._barcode = value;
    }

    get ata(): string {
        return this._ata;
    }

    set ata(value: string) {
        this._ata = value;
    }

    get creationDate(): TimeInstant {
        return this._creationDate;
    }

    set creationDate(value: TimeInstant) {
        this._creationDate = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get correctiveActions(): CorrectiveAction[] {
        return this._correctiveActions;
    }

    set correctiveActions(value: CorrectiveAction[]) {
        this._correctiveActions = value;
    }

    get steps(): Step[] {
        return this._steps;
    }

    set steps(value: Step[]) {
        this._steps = value;
    }

    get faultName(): string {
        return this._faultName;
    }

    set faultName(value: string) {
        this._faultName = value;
    }

    get parts(): Part[] {
        return this._parts;
    }

    set parts(value: Part[]) {
        this._parts = value ?  value.map(v =>
            Object.assign(Part.getInstance(), v )
        ) : [];
    }

    set report(value: string) {
        this._report = value;
    }

    get report(): string {
        return this._report;
    }
}

