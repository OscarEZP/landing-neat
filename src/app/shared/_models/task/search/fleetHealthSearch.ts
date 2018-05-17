import {Pagination} from '../../common/pagination';
import {TechnicalAnalysis} from '../fleethealth/technical/technicalAnalysis';

export class FleetHealthSearch {
    private _technicalAnalyzes: TechnicalAnalysis[];
    private _pagination: Pagination;

    private constructor(pagination: Pagination, technicalAnalyzes: TechnicalAnalysis[]) {
        this._pagination = pagination;
        this._technicalAnalyzes = technicalAnalyzes;
    }

    static getInstance(): FleetHealthSearch {
        return new FleetHealthSearch(Pagination.getInstance(), []);
    }

    get technicalAnalyzes(): TechnicalAnalysis[] {
        return this._technicalAnalyzes;
    }

    set technicalAnalyzes(value: TechnicalAnalysis[]) {
        this._technicalAnalyzes = value;
    }

    get pagination(): Pagination {
        return this._pagination;
    }

    set pagination(value: Pagination) {
        this._pagination = value;
    }
}
