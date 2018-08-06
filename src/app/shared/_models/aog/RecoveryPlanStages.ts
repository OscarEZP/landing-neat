import {Stage} from './Stage';

export class RecoveryPlanStages {
    private _stageList: Stage[];

    constructor(stageList: Stage[]) {
        this._stageList = stageList;
    }

    get stageList(): Stage[] {
        return this._stageList;
    }

    set stageList(value: Stage[]) {
        this._stageList = value;
    }
}
