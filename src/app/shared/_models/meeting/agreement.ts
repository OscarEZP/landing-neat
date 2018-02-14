import { TimeInstant } from '../timeInstant';

export class Agreement {

    private _id: number;
    private _description: string;
    private _create_user: string;
    private _create_dt: TimeInstant;


    constructor(  ) {
        this.id = null;
        this.description = null;
        this.create_user = null;
        this.create_dt = TimeInstant.getInstance();
    }

    static getInstance():Agreement{
        return new Agreement();
    }
    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id= value;
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