export class PartGroup {
    private _id: number;
    private _code: string;
    private _name: string;

    private constructor(id: number, code: string, name: string) {
        this._id = id;
        this._code = code;
        this._name = name;
    }

    public static getInstance() {
        return new PartGroup(null, null, null);
    }

    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get code(): string {
        return this._code;
    }

    set code(value: string) {
        this._code = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }
}
