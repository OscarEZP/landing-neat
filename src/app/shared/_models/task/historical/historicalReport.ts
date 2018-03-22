import {TimeInstant} from '../../timeInstant';
import {CorrectiveAction} from "./correctiveAction";
import {Step} from "./step";

export class HistoricalReport {


    private _barcode: string;
    private _ata: string;
    private _creationDate: TimeInstant;
    private _description: string;
    private _correctiveActions: CorrectiveAction[];
    private _steps: Step[];


   private constructor() {
        this._ata = '';
        this._barcode = '';
        this._description = '';
        this._correctiveActions = [];
        this._steps = [];
        this._creationDate = TimeInstant.getInstance();

    }

    public static getInstance() {
        return new HistoricalReport();
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
}

