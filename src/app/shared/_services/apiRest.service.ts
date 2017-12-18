import { HttpClient, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiRestService {

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

    public getPaginated<T>(path: string, page: string, quantity: string): Observable<T> {
        const requestOptions = {
            headers : new HttpHeaders({'page' : page, 'quantity' : quantity })
        };

        return this.http.get<T>(this.baseUrl + environment.paths[path], requestOptions);
    }

    public add<T>(path: string, itemToAdd: any, id?: string): Observable<T> {
        const toAdd = JSON.stringify(itemToAdd).replace(/\b[_]/g, '');

        return this.http.post<T>(this.baseUrl + environment.paths[path] + '/' + id, toAdd);
    }

    public update<T>(path: string, id: number, itemToUpdate: any): Observable<T> {
        return this.http.put<T>(this.baseUrl + environment.paths[path] + '/' + id, JSON.stringify(itemToUpdate));
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
