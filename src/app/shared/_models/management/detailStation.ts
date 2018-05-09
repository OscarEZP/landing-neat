import {Station} from "./station";

export class DetailStation {
    private _defaults: Station;
    private _others: Station[];


   private constructor(defaults: Station, others: Station[]) {
        this._defaults = defaults;
        this._others = others;
    }

    public static getInstance() {
        return new DetailStation(Station.getInstance(), []);
    }


    get defaults(): Station {
        return this._defaults;
    }

    set defaults(value: Station) {
        this._defaults = value;
    }

    get others(): Station[] {
        return this._others;
    }

    set others(value: Station[]) {
        this._others = value;
    }
}
