import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { Count } from '../../../shared/_models/configuration/count';
import { Contingency } from '../../../shared/_models/contingency';
import { ApiRestService } from '../../../shared/_services/apiRest.service';
import { InfiniteScrollService } from './infinite-scroll.service';
import { LogService } from './log.service';

@Injectable()
export class ContingencyService implements OnInit {

    private static CONTINGENCY_LIST_ENDPOINT = 'contingencyList';
    private static AIRCRAFT_SEARCH_ENDPOINT = 'aircraftsSearch';
    private static CLOSE_ENDPOINT = 'close';
    private static CONTINGENCY_SEARCH_ENDPOINT = 'contingencySearch';
    private static CONTINGENCY_SEARCH_COUNT_ENDPOINT = 'contingencySearchCount';

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

    ngOnInit() {
        this.getContingencies();
    }

    public getContingencies(): Observable<Contingency[]> {
        this.loading = true;
        return this.apiService
            .getAll<Contingency[]>(ContingencyService.CONTINGENCY_LIST_ENDPOINT)
            .pipe(
                tap((contingencies: Contingency[]) => {
                    this.loading = false;
                    this.contingencyListChanged.next(contingencies);
                })
            );
    }

    public getAircrafts(searchSignature: any): Observable<any> {
        return this.apiService.search<any>(ContingencyService.AIRCRAFT_SEARCH_ENDPOINT, searchSignature)
            .pipe(
                tap(aircrafts => this.log(`fetched aircrafts`)),
                catchError(this.handleError('getAircrafts'))
            );
    }

    public closeContingency(closeSignature: any): Observable<any> {
        return this.apiService.search<any>(ContingencyService.CLOSE_ENDPOINT, closeSignature).pipe(
            tap((signature: any) => this.log(`close contingency w/ id=${signature.id}`)),
            catchError(this.handleError<any>('closeContingency'))
        );
    }

    public getLastInformationPercetage(item: Contingency): number {
        const diff = (item.status.creationDate.epochTime - item.creationDate.epochTime) / (1000 * 60);
        const percentage = (diff / 180) * 100;
        return percentage > 100 ? 100 : percentage;
    }

    public postHistoricalSearch(searchSignature): Observable<any> {
        this.loading = true;
        return this.apiService.search<Contingency[]>(ContingencyService.CONTINGENCY_SEARCH_ENDPOINT, searchSignature)
        .pipe(
                tap(contingencies => {
                    this.log(`fetched search`);
                    this._contingencyList = contingencies;
                    if (contingencies.length > 0) {
                        contingencies.forEach((item) => {
                            item.lastInformationPercentage = this.getLastInformationPercetage(item);
                        });
                    }
                    this.loading = false;
                }),
                catchError(this.handleError('getContingencies'))
            );
    }

    public getTotalRecords(searchSignature): Observable<any> {
        return this.apiService.search<Count>(ContingencyService.CONTINGENCY_SEARCH_COUNT_ENDPOINT, searchSignature)
            .pipe(
                tap(count => {
                    this.log(`fetched count search`);
                    this._infiniteScrollService.length = count.items;
                }),
                catchError(this.handleError('getContingencies'))
            );
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            console.log(error);

            this.log(`${operation} failed: ${error.message}`);

            return Observable.throw(error.error);

        };
    }

    /** Log a HeroService message with the MessageService */
    private log(message: string) {
        this.logService.add('HeroService: ' + message);
    }
}
