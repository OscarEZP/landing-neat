import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AircraftList } from '../_models/aircraft';
import { FlightList } from '../_models/flight';
import { LogService } from './log.service';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class ContingencyService {
    private apiUrl = environment.apiUrl;
    private closePath = environment.paths.close;

    constructor(
        private http: HttpClient,
        private logService: LogService
    ) { }

    closeContingency (closeSignature: any): Observable<any> {
        return this.http.post<any>(this.apiUrl + this.closePath, closeSignature, httpOptions).pipe(
            tap((signature: any) => this.log(`close contingency w/ id=${signature.id}`)),
            catchError(this.handleError<any>('closeContingency'))
        );
    }

    getAircrafts(): Observable<AircraftList[]> {
        return this.http.get<AircraftList[]>('api/aircrafts')
            .pipe(
            tap(aircrafts => this.log(`fetched aircrafts`)),
            catchError(this.handleError('getAircrafts', []))
            );
    }

    getFlights(): Observable<FlightList[]> {
        return this.http.get<FlightList[]>('api/flights')
            .pipe(
            tap(flights => this.log(`fetched flights`)),
            catchError(this.handleError('getFlights', []))
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
