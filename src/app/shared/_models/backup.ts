import { TimeInstant } from './timeInstant';

export class Backup {

    private _location: string;
    private _slot: TimeInstant;

    constructor(location: string, slot: TimeInstant) {
        this._location = location;
        this._slot = slot;
    }

    get location(): string {
        return this._location;
    }

    set location(value: string) {
        this._location = value;
    }

    get slot(): TimeInstant {
        return this._slot;
    }

    set slot(value: TimeInstant) {
        this._slot = value;
    }
}
