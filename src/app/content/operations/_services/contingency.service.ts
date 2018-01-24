import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { environment } from '../../../../environments/environment';
import { Aircraft } from '../../../shared/_models/aircraft';
import { Count } from '../../../shared/_models/configuration/count';
import { Contingency } from '../../../shared/_models/contingency';
import { ApiRestService } from '../../../shared/_services/apiRest.service';
import { InfiniteScrollService } from './infinite-scroll.service';
import { LogService } from './log.service';

const httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class ContingencyService {

    private static apiUrl = environment.apiUrl;
    private static closePath = environment.paths.close;
    private static searchAircraftPath = environment.paths.aircraftsSearch;
    private static contingencySearch = environment.paths.contingencySearch;
    private static contingencySearchCount = environment.paths.contingencySearchCount;

    private _contingencyList: Contingency[];
    private _loading: boolean;
    private _contingencyListChanged: Subject<Contingency[]> = new Subject<Contingency[]>();
    private _apiService: ApiRestService;

    constructor(private http: HttpClient,
                private logService: LogService,
                private _infiniteScrollService: InfiniteScrollService) {

        this.contingencyList = [];

        this.loading = false;
        this.apiService = new ApiRestService(this.http);

        this.contingencyListChanged.subscribe((value: Contingency[]) => {
            this.contingencyList = value;
        });
    }

    get contingencyList(): Contingency[] {
        return this._contingencyList;
    }

    set contingencyList(value: Contingency[]) {
        this._contingencyList = value;
    }

    get loading(): boolean {
        return this._loading;
    }

    set loading(value: boolean) {
        this._loading = value;
    }

    get contingencyListChanged(): Subject<Contingency[]> {
        return this._contingencyListChanged;
    }

    set contingencyListChanged(value: Subject<Contingency[]>) {
        this._contingencyListChanged = value;
    }

    get apiService(): ApiRestService {
        return this._apiService;
    }

    set apiService(value: ApiRestService) {
        this._apiService = value;
    }

    public getContingencies(): Observable<Contingency[]> {
        this.loading = true;
        return this.apiService
            .getAll<Contingency[]>('contingencyList')
            .pipe(
                tap((contingencies: Contingency[]) => {
                    this.loading = false;
                    this.contingencyListChanged.next(contingencies);
                })
            );
    }

    public getAircrafts(searchSignature: any): Observable<Aircraft[]> {
        return this.http.post<Aircraft[]>(ContingencyService.apiUrl + ContingencyService.searchAircraftPath, searchSignature, httpOptions)
            .pipe(
                tap(aircrafts => this.log(`fetched aircrafts`)),
                catchError(this.handleError('getAircrafts', []))
            );
    }

    public closeContingency(closeSignature: any): Observable<any> {
        return this.http.post<any>(ContingencyService.apiUrl + ContingencyService.closePath, closeSignature, httpOptions).pipe(
            tap((signature: any) => this.log(`close contingency w/ id=${signature.id}`)),
            catchError(this.handleError<any>('closeContingency'))
        );
    }

    public postHistoricalSearch(searchSignature): Observable<Contingency[]> {
        this.loading = true;
        return this.http.post<any>(ContingencyService.apiUrl + ContingencyService.contingencySearch, searchSignature, httpOptions)
            .pipe(
                tap(contingencies => {
                    this.log(`fetched search`);
                    this._contingencyList = contingencies;
                    if (contingencies.length > 0) {
                        contingencies.forEach((item) => {
                            const diff = (item.status.creationDate.epochTime - item.creationDate.epochTime) / (1000 * 60);
                            const percentage = (diff / 180) * 100;
                            item.lastInformationPercentage = percentage > 100 ? 100 : percentage;
                        });
                    }
                    this.loading = false;
                }),
                catchError(this.handleError('getContingencies', []))
            );
    }

    public getTotalRecords(searchSignature): Observable<any> {
        return this.http.post<Count>(ContingencyService.apiUrl + ContingencyService.contingencySearchCount, searchSignature, httpOptions)
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
