import { TimeInstant } from '../timeInstant';

export class Pending {

    private _id: number;
    private _area: string;
    private _description: string;
    private _create_user: string;
    private _create_dt: TimeInstant;


    constructor( area: string, description: string, create_user: string) {
        this._area = area;
        this._description = description;
        this._create_user = create_user;

    }

    static getInstance():Pending{
        return new Pending(null,null,null);
    }
    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id= value;
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