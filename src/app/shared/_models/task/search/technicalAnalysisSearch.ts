import {Pagination} from '../../common/pagination';

export class TechnicalAnalysisSearch {
    private _station: string;
    private _pagination: Pagination;

    private constructor(pagination: Pagination, station: string) {
        this._pagination = Pagination.getInstance();
        this._station = station;
    }

    static getInstance(): TechnicalAnalysisSearch {
        return new TechnicalAnalysisSearch(Pagination.getInstance(), null);
    }


    get station(): string {
        return this._station;
    }

    set station(value: string) {
        this._station = value;
    }

    get pagination(): Pagination {
        return this._pagination;
    }

    set pagination(value: Pagination) {
        this._pagination = value;
    }
}
