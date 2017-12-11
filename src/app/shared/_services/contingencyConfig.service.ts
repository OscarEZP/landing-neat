import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable()
export class ContingencyConfigService {

    private baseUrl: string;

    constructor(private http: HttpClient) {
        this.baseUrl = environment.apiUrl;
    }

    public getAll<T>(path: string): Observable<T> {
        return this.http.get<T>(this.baseUrl + environment.paths[path]);
    }

    public getSingle<T>(path: string, id: number): Observable<T> {
        return this.http.get<T>(this.baseUrl + environment.paths[path] + '/' + id);
    }

    public add<T>(path: string, itemToAdd: any): Observable<T> {
        const toAdd = JSON.stringify(itemToAdd);

        return this.http.post<T>(this.baseUrl + environment.paths[path], toAdd);
    }

    public update<T>(path: string, id: number, itemToUpdate: any): Observable<T> {
        return this.http
                   .put<T>(this.baseUrl + environment.paths[path] + '/' + id, JSON.stringify(itemToUpdate));
    }

    public delete<T>(path: string, id: number): Observable<T> {
        return this.http.delete<T>(this.baseUrl + environment.paths[path] + '/' + id);
    }
}

@Injectable()
export class CustomInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!req.headers.has('Content-Type')) {
            req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
        }

        req = req.clone({ headers: req.headers.set('Accept', 'application/json') });
        console.log(JSON.stringify(req.headers));
        return next.handle(req);
    }
}

/*
    public getSafetyConfig<T>(): Observable<T> {
        return this.http.get<T>(this.safetyEventsConfigUrl);

        return new Promise((resolve, reject) => {
            this.http
                .get(this.urlBase + this.safetyEventsConfigUrl)
                .toPromise()
                .then( data => {
                    this.safetyList = [];
                    const jsonData = data.json();
                    _.forEach(jsonData, function(value) {
                        this.safetyList.push(new Safety(value.code, value.description));
                    });

                    let i;
                    for (i = 0; i < jsonData.length; i++) {
                        this.safetyList[i] = new Safety(jsonData[i].code, jsonData[i].description);
                    }

                    resolve();
                }, reason => {
                    this.messageService.openSnackBar(reason);
                    reject(reason);
                });
        });

    }

    public getAircraftConfig() {
        return new Promise((resolve, reject) => {
            this.http
                .get(this.urlBase + this.aircraftConfigUrl)
                .toPromise()
                .then(data => {
                    this.aircraftList = [];
                    const jsonData = data.json();
                    let i;
                    for (i = 0; i < jsonData.length; i++) {
                        this.aircraftList[i] = new Aircraft(jsonData[i].tail, jsonData[i].fleet, jsonData[i].operator);
                    }
                    resolve();
                }, reason => {
                    this.messageService.openSnackBar(reason);
                    reject(reason);
                });
        });
    }

    public getFlightsConfig() {
        return new Promise((resolve, reject) => {
            this.http
                .get(this.urlBase + this.flightConfigUrl)
                .toPromise()
                .then(data => {
                    this.flightList = [];
                    const jsonData = data.json();
                    let i;
                    for (i = 0; i < jsonData.length; i++) {
                        const legList = [];
                        for (let j = 0; j < jsonData[i].legs.length; j++) {
                            const legItem = new Legs(
                                jsonData[i].legs[j].origin,
                                jsonData[i].legs[j].destination,
                                new TimeInstant(
                                    jsonData[i].legs[j].updateDate.epochTime,
                                    jsonData[i].legs[j].updateDate.label
                                ),
                                new TimeInstant(
                                    jsonData[i].legs[j].etd.epochTime,
                                    jsonData[i].legs[j].etd.label
                                )
                            );
                            legList.push(legItem);
                        }

                        const flightConfig = new FlightConfiguration(
                            jsonData[i].flightNumber,
                            legList);
                        this.flightList.push(flightConfig);
                    }
                    resolve();
                }, reason => {
                    this.messageService.openSnackBar(reason);
                    reject(reason);
                });
        });
    }

    public getTypeConfig () {
        return new Promise((resolve, reject) => {
            this.http
                .get(this.urlBase + this.typeConfigUrl)
                .toPromise()
                .then(data => {
                    this.typeList = [];
                    const jsonData = data.json();
                    for (let i = 0; i < jsonData.length; i++) {
                        const items = [];
                        for (let j = 0; j < jsonData[i].types.length; j++) {
                            const typeItem = new Types(
                                jsonData[i].types[j].code,
                                jsonData[i].types[j].description,
                                new TimeInstant(
                                    jsonData[i].types[j].updateDate.epochTime,
                                    jsonData[i].types[j].updateDate.label
                                )
                            );
                            items.push(typeItem);
                        }
                        const typeGroup = new GroupTypes(
                            jsonData[i].groupName,
                            items
                        );
                        this.typeList.push(typeGroup);
                    }

                    // this.separateTypes(this.typeList);
                    resolve();
                }, reason => {
                    this.messageService.openSnackBar(reason);
                    reject(reason);
                });
        });
    }

}
 */
