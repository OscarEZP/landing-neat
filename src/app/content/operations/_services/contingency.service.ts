import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Aircraft } from '../../../shared/_models/aircraft';
import { LogService } from './log.service';
import {Contingency} from '../../../shared/_models/contingency';
import {InfiniteScrollService} from './infinite-scroll.service';
import {ApiRestService} from '../../../shared/_services/apiRest.service';
import {DetailsService} from '../../../details/_services/details.service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ContingencyService {
    private apiUrl = environment.apiUrl;
    private closePath = environment.paths.close;
    private searchAircraftPath = environment.paths.aircraftsSearch;
    private contingencySearch = environment.paths.contingencySearch;
    public data: Contingency[];
    private _loading: boolean;

    constructor(
        private http: HttpClient,
        private logService: LogService,
        private _infiniteScrollService: InfiniteScrollService,
        private _apiService: ApiRestService,
        private _detailsService: DetailsService
    ) {
        this.data = [];
        this._loading = false;
    }

    get loading(): any {
        return this._loading;
    }

    public getContingencies(): Observable<Contingency[]> {
        this._loading = true;
        return this._apiService
        .getAll<Contingency[]>('contingencyList')
        .pipe(
            tap(contingencies => {
                this.data = contingencies;
                if (contingencies.length > 0) {
                    this._detailsService.contingency = this.data[0];
                }
                this._loading = false;
                this._infiniteScrollService.length = contingencies.length;
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

    public closeContingency (closeSignature: any): Observable<any> {
        return this.http.post<any>(this.apiUrl + this.closePath, closeSignature, httpOptions).pipe(
            tap((signature: any) => this.log(`close contingency w/ id=${signature.id}`)),
            catchError(this.handleError<any>('closeContingency'))
        );
    }

    public postHistoricalSearch(searchSignature): Observable<Contingency[]> {
        this._loading = true;
        this.getTotalRecords(searchSignature).subscribe((data) => {
            this._infiniteScrollService.length = data.length;
        });
        return this.http.post<any>(this.apiUrl + this.contingencySearch, searchSignature, httpOptions)
        .pipe(
            tap(contingencies => {
                this.log(`fetched search`);
                this.data = contingencies;
                if (contingencies.length > 0) {
                    contingencies.forEach((item) => {

                        // Walkaround until close contingency form update
                        item.close.type = item.close.type.toLowerCase() === 'release' ? 'rlsd' : item.close.type;

                        const diff = (item.status.creationDate.epochTime - item.creationDate.epochTime) / (1000 * 60);
                        const percentage = (diff / 180) * 100;
                        item.lastInformationPercentage = percentage > 100 ? 100 : percentage;
                    });
                    this._detailsService.contingency = this.data[0];
                }
                this._loading = false;
            }),
            catchError(this.handleError('getContingencies', []))
        );
    }

    public getTotalRecords(searchSignature): Observable<any> {
        const countSignature = {
            offSet: 0,
            limit: 100000000,
            from: searchSignature.from,
            to: searchSignature.to,
            tails: searchSignature.tails
        };
        return this.http.post<any>(this.apiUrl + this.contingencySearch, countSignature, httpOptions)
        .pipe(
            tap(contingencies => {
                this.log(`fetched count search`);
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
