import {Injectable} from '@angular/core';
import {User} from '../_models/user.model';
import {Http, Response} from '@angular/http'
import 'rxjs/add/operator/toPromise';
import * as constants from '../../constants';

@Injectable()
export class AuthService {

    private isLoggedIn: boolean;
    private redirectUrl: string;
    private loginUrl: string;
    private user: User;
    private headers: Headers;
    private data: { username: string, password: string };

    constructor(private http: Http) {
        this.headers = new Headers({'Content-Type': 'application/json'});
        this.isLoggedIn = this.getIsLoggedIn();
        this.redirectUrl = '/dashboard';
        this.loginUrl = '/login';
        this.user = new User();
        this.data = {username: '', password: ''};


    }

    logIn(username: string, password: string): Promise<User> {

        this.user = new User();
        this.user.userName = username;
        this.user.password = password;

        return this.http
            .post(constants.API_POST_LOGIN, JSON.stringify(this.user), this.headers)
            .toPromise()
            .then(value => {
                this.user = value.json();
                localStorage.setItem('currentUser', this.user.userName);
                this.extractData(value);
            }).catch(this.handleError);

    }

    logOut() {
        this.isLoggedIn = false;
        localStorage.removeItem('currentUser');
        this.user = new User();
    }

    getIsLoggedIn() {
        return localStorage.getItem('currentUser') ? true : false
    }

    getRedirectUrl(): string {
        return this.redirectUrl;
    }

    getLoginUrl(): string {
        return this.loginUrl;
    }

    getCurrentUser(): User {
        return this.user;
    }

    getData() {
        return this.data;
    }
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || {};
    }
}
