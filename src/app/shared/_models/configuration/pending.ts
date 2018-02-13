import { TimeInstant } from '../timeInstant';

export class Pending {

    private _seq: number;
    private _area: string;
    private _description: string;
    private _create_user: string;
    private _create_dt: TimeInstant;


    constructor(seq: number, area: string, description: string, create_user: string, create_dt: TimeInstant) {
        this._seq = seq;
        this._area = area;
        this._description = description;
        this._create_user = create_user;
        this._create_dt = create_dt;
    }


    get seq(): number {
        return this._seq;
    }

    set seq(value: number) {
        this._seq = value;
    }

    get area(): string {
        return this._area;
    }

    set area(value: string) {
        this._area = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get create_user(): string {
        return this._create_user;
    }

    set create_user(value: string) {
        this._create_user = value;
    }

    get create_dt(): TimeInstant {
        return this._create_dt;
    }

    set create_dt(value: TimeInstant) {
        this._create_dt = value;
    }
}