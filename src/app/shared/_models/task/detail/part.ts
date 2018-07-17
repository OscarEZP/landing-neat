import {TimeInstant} from '../../timeInstant';
import {PartGroup} from './partGroup';


export class Part {

    private _id: number;
    private _barcode: string;
    private _code: string;
    private _name: string;
    private _status: string;
    private _actionCode: string;
    private _requestCode: string;
    private _quantity: number;
    private _estimatedArrivalDate: TimeInstant;
    private _partGroup: PartGroup;
    private _updateDate: TimeInstant;


    constructor(id: number, barcode: string, code: string, name: string, status: string, actionCode: string, requestCode: string, quantity: number, estimatedArrivalDate: TimeInstant, partGroup: PartGroup) {
        this._id = id;
        this._barcode = barcode;
        this._code = code;
        this._name = name;
        this._status = status;
        this._actionCode = actionCode;
        this._requestCode = requestCode;
        this._quantity = quantity;
        this._estimatedArrivalDate = estimatedArrivalDate;
        this._partGroup = partGroup;
    }
    public static getInstance() {
        return new Part(null, null, null, null , null, null, null, null,  TimeInstant.getInstance(), PartGroup.getInstance());
    }
    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get barcode(): string {
        return this._barcode;
    }

    set barcode(value: string) {
        this._barcode = value;
    }

    get code(): string {
        return this._code;
    }

    set code(value: string) {
        this._code = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get status(): string {
        return this._status;
    }

    set status(value: string) {
        this._status = value;
    }

    get actionCode(): string {
        return this._actionCode;
    }

    set actionCode(value: string) {
        this._actionCode = value;
    }

    get requestCode(): string {
        return this._requestCode;
    }

    set requestCode(value: string) {
        this._requestCode = value;
    }

    get quantity(): number {
        return this._quantity;
    }

    set quantity(value: number) {
        this._quantity = value;
    }

    get estimatedArrivalDate(): TimeInstant {
        return this._estimatedArrivalDate;
    }

    set estimatedArrivalDate(value: TimeInstant) {
        this._estimatedArrivalDate = value;
    }

    get partGroup(): PartGroup {
        return this._partGroup;
    }

    set partGroup(value: PartGroup) {
        this._partGroup = Object.assign(PartGroup.getInstance(), value);
    }

    get updateDate(): TimeInstant {
        return this._updateDate;
    }

    set updateDate(value: TimeInstant) {
        this._updateDate = value;
    }
}
