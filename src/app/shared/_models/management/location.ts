export class Location {
    private _defaults: string;
    private _other: string[];


   private constructor(defaults: string, other: string[]) {
        this._defaults = defaults;
        this._other = other;
    }

    public static getInstance() {
        return new Location(null, []);
    }

    get defaults(): string {
        return this._defaults;
    }

    set defaults(value: string) {
        this._defaults = value;
    }

    get other(): string[] {
        return this._other;
    }

    set other(value: string[]) {
        this._other = value;
    }
}
