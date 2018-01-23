import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import 'rxjs/add/operator/do';
import {Router} from "@angular/router";

@Injectable()
export class ApiRestService {

    private baseUrl: string;

    constructor(private http: HttpClient) {
        this.baseUrl = environment.apiUrl;
    }

    public getAll<T>(path: string): Observable<T> {
        return this.http.get<T>(this.baseUrl + environment.paths[path]);
    }

    public getSingle<T>(path: string, id: number | string): Observable<T> {
        return this.http.get<T>(this.baseUrl + environment.paths[path] + '/' + id);
    }

    public getPaginated<T>(path: string, page: string, quantity: string): Observable<T> {
        const requestOptions = {
            headers: new HttpHeaders({'page': page, 'quantity': quantity})
        };

        return this.http.get<T>(this.baseUrl + environment.paths[path], requestOptions);
    }

    public search<T>(path: string, itemToSearch: any): Observable<T> {
        const toSearch = JSON.stringify(itemToSearch).replace(/\b[_]/g, '');
        return this.http.post<T>(this.baseUrl + environment.paths[path], toSearch);
    }

    public add<T>(path: string, itemToAdd: any, id?: string): Observable<T> {
        const toAdd = JSON.stringify(itemToAdd).replace(/\b[_]/g, '');
        const finalPath = id !== undefined ? environment.paths[path] + '/' + id : environment.paths[path];

        return this.http.post<T>(this.baseUrl + finalPath, toAdd);
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

    private _storageService: StorageService;

    constructor(inj: Injector) {
        this._storageService = inj.get(StorageService);
    }

    private static SESSION_ERROR_CODE = 472;

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (!req.headers.has('Content-Type')) {
            req = req.clone({headers: req.headers.set('Content-Type', 'application/json')});
        }
        req = req.clone({headers: req.headers.set('Accept', 'application/json')});
        const accessToken = this._storageService.getCurrentUser().accessToken ? this._storageService.getCurrentUser().accessToken : '';
        req = req.clone({headers: req.headers.set('Authorization', accessToken)});

        return next.handle(req).do(event => {}, err => {
            if (err instanceof HttpErrorResponse && err.status === CustomInterceptor.SESSION_ERROR_CODE) {
                this._storageService.removeCurrentUser();
            }
        });
    }
}
