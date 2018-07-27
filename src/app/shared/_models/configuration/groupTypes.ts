import { Types } from './types';

export class GroupTypes {

    private _groupName: string;
    private _types: Types[];

    constructor(groupName: string = '', types: Types[] = []) {
        this._groupName = groupName;
        this._types = types;
    }

    get groupName(): string {
        return this._groupName;
    }

    set groupName(value: string) {
        this._groupName = value;
    }

    get types(): Types[] {
        return this._types;
    }

    set types(value: Types[]) {
        this._types = value;
    }
}
