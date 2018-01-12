import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Aircraft } from '../../../shared/_models/aircraft';
import { LogService } from './log.service';
import { Contingency } from '../../../shared/_models/contingency';
import { InfiniteScrollService } from './infinite-scroll.service';
import { ApiRestService } from '../../../shared/_services/apiRest.service';
import { DetailsService } from '../../../details/_services/details.service';
import { Count } from '../../../shared/_models/configuration/count';

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class ContingencyService {

    private apiUrl = environment.apiUrl;
    private closePath = environment.paths.close;
    private searchAircraftPath = environment.paths.aircraftsSearch;
    private contingencySearch = environment.paths.contingencySearch;
    private contingencySearchCount = environment.paths.contingencySearchCount;
    public data: Contingency[];
    private _loading: boolean;

    constructor(private http: HttpClient,
                private logService: LogService,
                private _infiniteScrollService: InfiniteScrollService,
                private _apiService: ApiRestService,
                private _detailsService: DetailsService) {
        this.data = [];
        this.loading = false;
    }

    get loading(): boolean {
        return this._loading;
    }

    set loading(value: boolean) {
        this._loading = value;
    }

    public getContingencies(): Observable<Contingency[]> {
        this.loading = true;
        return this._apiService
            .getAll<Contingency[]>('contingencyList')
            .pipe(
                tap(contingencies => {
                    this.data = contingencies;
                    if (contingencies.length > 0) {
                        this._detailsService.contingency = this.data[0];
                    }
                    this.loading = false;
                })
            );
    }

    public getAircrafts(searchSignature: any): Observable<Aircraft[]> {
        return this.http.post<Aircraft[]>(this.apiUrl + this.searchAircraftPath, searchSignature, httpOptions)
            .pipe(
                tap(aircrafts => this.log(`fetched aircrafts`)),
                catchError(this.handleError('getAircrafts', []))
            );
    }

    public closeContingency(closeSignature: any): Observable<any> {
        return this.http.post<any>(this.apiUrl + this.closePath, closeSignature, httpOptions).pipe(
            tap((signature: any) => this.log(`close contingency w/ id=${signature.id}`)),
            catchError(this.handleError<any>('closeContingency'))
        );
    }

    public postHistoricalSearch(searchSignature): Observable<Contingency[]> {
        this.loading = true;
        return this.http.post<any>(this.apiUrl + this.contingencySearch, searchSignature, httpOptions)
            .pipe(
                tap(contingencies => {
                    this.log(`fetched search`);
                    this.data = contingencies;
                    if (contingencies.length > 0) {
                        contingencies.forEach((item) => {
                            const diff = (item.status.creationDate.epochTime - item.creationDate.epochTime) / (1000 * 60);
                            const percentage = (diff / 180) * 100;
                            item.lastInformationPercentage = percentage > 100 ? 100 : percentage;
                        });
                        this._detailsService.contingency = this.data[0];
                    }
                    this.loading = false;
                }),
                catchError(this.handleError('getContingencies', []))
            );
    }

    public getTotalRecords(searchSignature): Observable<any> {
        return this.http.post<Count>(this.apiUrl + this.contingencySearchCount, searchSignature, httpOptions)
            .pipe(
                tap(count => {
                    this.log(`fetched count search`);
                    this._infiniteScrollService.length = count.items;
                }),
                catchError(this.handleError('getContingencies', []))
            );
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            // TODO: send the error to remote logging infrastructure
            console.log(error); // log to console instead

            // TODO: better job of transforming error for user consumption
            this.log(`${operation} failed: ${error.message}`);

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

    /** Log a HeroService message with the MessageService */
    private log(message: string) {
        this.logService.add('HeroService: ' + message);
    }
}
