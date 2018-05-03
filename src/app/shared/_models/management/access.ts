export class Access {
    private _module: string;
    private _role: string;


    private constructor(module: string, role: string) {
        this._module = module;
        this._role = role;
    }

    public static getInstance() {
        return new Access(null, null);
    }


    get module(): string {
        return this._module;
    }

    set module(value: string) {
        this._module = value;
    }

    get role(): string {
        return this._role;
    }

    set role(value: string) {
        this._role = value;
    }
}
