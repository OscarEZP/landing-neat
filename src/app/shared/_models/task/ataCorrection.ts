export class AtaCorrection {

    private _taskId: number;
    private _correctedATA: string;
    private _updateATAUser: string;

    constructor(taskId: number, correctedATA: string, updateATAUser: string) {
        this._taskId = taskId;
        this._correctedATA = correctedATA;
        this._updateATAUser = updateATAUser;
    }

    get taskId(): number {
        return this._taskId;
    }

    set taskId(value: number) {
        this._taskId = value;
    }

    get correctedATA(): string {
        return this._correctedATA;
    }

    set correctedATA(value: string) {
        this._correctedATA = value;
    }

    get updateATAUser(): string {
        return this._updateATAUser;
    }

    set updateATAUser(value: string) {
        this._updateATAUser = value;
    }
}
