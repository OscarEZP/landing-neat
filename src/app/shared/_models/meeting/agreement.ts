import { TimeInstant } from '../timeInstant';

export class Agreement {

    private _id: number;
    private _description: string;
    private _createUser: string;
    private _createDate: TimeInstant;


    constructor(  ) {
        this.id = null;
        this.description = null;
        this.createUser = null;
        this.createDate = TimeInstant.getInstance();
    }

    static getInstance(): Agreement {
        return new Agreement();
    }
    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
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
