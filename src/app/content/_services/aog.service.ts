import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {catchError, tap} from 'rxjs/operators';
import {ApiRestService} from '../../shared/_services/apiRest.service';
import {LogService} from './log.service';
import {AogSearch} from '../../shared/_models/aog/aogSearch';
import {Count} from '../../shared/_models/common/count';
import {Aog} from '../../shared/_models/aog/aog';

@Injectable()
export class AogService {

    private static AIRCRAFT_ON_GROUND_SEARCH_ENDPOINT = 'aircraftOnGroundSearch';
    private static AIRCRAFT_ON_GROUND_SEARCH_COUNT_ENDPOINT = 'aircraftOnGroundSearchCount';
    private _apiService: ApiRestService;

    constructor(private http: HttpClient,
                private logService: LogService) {
        this.apiService = new ApiRestService(this.http);
    }

    public search(search: AogSearch): Observable<any> {
        return this.apiService
            .search<Aog[]>(AogService.AIRCRAFT_ON_GROUND_SEARCH_ENDPOINT, search)
            .pipe(
                tap((x: Aog[]) => {
                    this.log('fetched aircraftOnGround');
                }),
                catchError(this.handleError('aircraftOnGroundSearch'))
            );
    }


    public getTotalRecords(search: AogSearch): Observable<any> {
        return this.apiService.search<Count>(AogService.AIRCRAFT_ON_GROUND_SEARCH_COUNT_ENDPOINT, search)
            .pipe(
                tap((count: Count) => {
                    this.log(`fetched count search`);
                }),
                catchError(this.handleError('getTotalRecordsAircraftOnGround'))
            );
    }

    /**
     *
     * @param {string} tail
     * @returns {Promise<boolean>}
     */
    public validateTail(tail: string): Promise<boolean> {
        const search: AogSearch = AogSearch.getInstance();
        search.isClose = false;
        search.tails = [tail];
        return this.search(search)
            .toPromise()
            .then((res: Aog[]) => {
                if (res.length > 0) {
                    return Promise.resolve(false);
                } else {
                    return Promise.resolve(true);
                }
            });
    }

    private handleError<T>(operation = 'operation') {
        return (error: any): Observable<T> => {
            this.log(`${operation} failed: ${error.message}`);
            return Observable.throw(error);
        };
    }

    /** Log a HeroService message with the MessageService */
    private log(message: string) {
        this.logService.add('HeroService: ' + message);
    }

    get apiService(): ApiRestService {
        return this._apiService;
    }

    set apiService(value: ApiRestService) {
        this._apiService = value;
    }
}
