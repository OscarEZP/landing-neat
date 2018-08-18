import {Pagination} from '../common/pagination';

export class RecoveryPlanSearch {
    private _aogId: number;
    private _pagination: Pagination;
    private _enable: boolean;


    private constructor(pagination: Pagination, aogId: number, enable: boolean) {
        this._pagination = pagination;
        this._aogId = aogId;
        this._enable = enable;

    }

    static getInstance(): RecoveryPlanSearch {
        return new RecoveryPlanSearch(Pagination.getInstance(), null, true);
    }

    get aogId(): number {
        return this._aogId;
    }

    set aogId(value: number) {
        this._aogId = value;
    }

    get pagination(): Pagination {
        return this._pagination;
    }

    set pagination(value: Pagination) {
        this._pagination = value;
    }

    get enable(): boolean {
        return this._enable;
    }

    set enable(value: boolean) {
        this._enable = value;
    }
}
