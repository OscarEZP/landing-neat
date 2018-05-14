import {Pagination} from '../../common/pagination';
import {TechnicalAnalysis} from '../fleethealth/technical/technicalAnalysis';

export class FleetHealthSearch {
    private _technicalAnalysis: TechnicalAnalysis;
    private _pagination: Pagination;

    private constructor(pagination: Pagination, technicalAnalysis: TechnicalAnalysis) {
        this._pagination = pagination;
        this._technicalAnalysis = technicalAnalysis;
    }

    static getInstance(): FleetHealthSearch {
        return new FleetHealthSearch(Pagination.getInstance(), TechnicalAnalysis.getInstance());
    }

    get technicalAnalysis(): TechnicalAnalysis {
        return this._technicalAnalysis;
    }

    set technicalAnalysis(value: TechnicalAnalysis) {
        this._technicalAnalysis = value;
    }

    get pagination(): Pagination {
        return this._pagination;
    }

    set pagination(value: Pagination) {
        this._pagination = value;
    }
}
