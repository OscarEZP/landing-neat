import { TimeInstant } from '../timeInstant';

export class Pending {

    private _id: number;
    private _area: string;
    private _description: string;
    private _createUser: string;
    private _createDate: TimeInstant;


    constructor( area: string, description: string, createUser: string) {
        this.area = area;
        this.description = description;
        this.createUser = createUser;

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

    set createUser(value: string) {
        this._createUser = value;
    }

    set createDate(value: TimeInstant) {
        this._createDate = value;
    }

    get createUser(): string {
        return this._createUser;
    }

    get createDate(): TimeInstant {
        return this._createDate;
    }
}