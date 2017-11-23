import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class WebApiObservableService {
    headers: Headers;
    options: RequestOptions;

    constructor(private http: Http) {
        this.headers = new Headers(
            {
                'Content-Type': 'application/json',
                'Accept': 'q=0.8;application/json;q=0.9'
            });
        this.options = new RequestOptions({headers: this.headers});
    }

    callService(url: string, param: any, method: string = 'GET'): Observable<any> {
        const body = JSON.stringify(param);
        let result;
        method = method.toUpperCase();
        switch (method) {
            case 'POST':
                result = this.http
                    .post(url, body, this.options)
                    .map(this.extractData)
                    .catch(this.handleError);
                break;
            case 'GET':
                result = this.http
                    .get(url, this.options)
                    .map(this.extractData)
                    .catch(this.handleError);
                break;
        }
        return result;
    }

    private extractData(res: Response) {
        const body = res.json();
        return body || {};
    }

    private handleError(error: any) {
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}
