import { TimeInstant } from '../timeInstant';

export class Pending {

    private _id: number;
    private _area: string;
    private _description: string;
    private _createUser: string;
    private _createDate: TimeInstant;


    constructor(area: string, description: string, createUser: string) {
        this._area = area;
        this._description = description;
        this._createUser = createUser;
    }

    static getInstance(): Pending {
        return new Pending(null, null, null);
    }
    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
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

    get createUser(): string {
        return this._createUser;
    }

    set createUser(value: string) {
        this._createUser = value;
    }

    get createDate(): TimeInstant {
        return this._createDate;
    }

    set createDate(value: TimeInstant) {
        this._createDate = value;
    }
}
