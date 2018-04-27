export class Group {

    private _description: string;
    private _level: number;
    private _name: string;

    constructor(description: string, level: number, name: string) {
        this._description = description;
        this._level = level;
        this._name = name;
    }

    public static getInstance() {
        return new Group('', 0, '');
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get level(): number {
        return this._level;
    }

    set level(value: number) {
        this._level = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }
}
