export class Module {
    private _code: string;
    private _roles: string[];
    private _description: string;


    constructor(code: string = '', roles: string[] = [], description: string = '') {
        this._code = code;
        this._roles = roles;
        this._description = description;
    }

    public static getInstance() {
        return new Module('', [], '');
    }

    get code(): string {
        return this._code;
    }

    set code(value: string) {
        this._code = value;
    }

    get roles(): string[] {
        return this._roles;
    }

    set roles(value: string[]) {
        this._roles = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }
}
