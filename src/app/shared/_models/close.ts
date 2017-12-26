import {TimeInstant} from "./timeInstant";
export class Close {
    private _closeDate: TimeInstant;
    private _id: number;
    private _observation: string;
    private _type: string;
    private _username: string;

    constructor () {

    }

    get closeDate(): TimeInstant {
        return this._closeDate;
    }

    set closeDate(value: TimeInstant) {
        this._closeDate = value;
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get observation(): string {
        return this._observation;
    }

    set observation(value: string) {
        this._observation = value;
    }

    get type(): string {
        return this._type;
    }

    set type(value: string) {
        this._type = value;
    }

    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }
}
