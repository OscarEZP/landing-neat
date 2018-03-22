import {Review} from './review';
import {Remark} from "./remark";

export class Analysis {
    private _barcode:string
    private _username: string;
    private _alertCode: string;
    private _remarks: Remark[];
    private _reviews: Review[];



    private constructor() {
        this._remarks = [];
        this._reviews = [];
        this._username = '';
        this._barcode='';
        this._alertCode='';

    }

    public static getInstance() {
        return new Analysis();
    }

    get barcode(): string {
        return this._barcode;
    }

    set barcode(value: string) {
        this._barcode = value;
    }

    get alertCode(): string {
        return this._alertCode;
    }

    set alertCode(value: string) {
        this._alertCode = value;
    }

    get remarks(): Remark[] {
        return this._remarks;
    }

    set remarks(value: Remark[]) {
        this._remarks = value;
    }

    get reviews(): Review[] {
        return this._reviews;
    }

    set reviews(value: Review[]) {
        this._reviews = value;
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }
}

