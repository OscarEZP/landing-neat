import {Injectable} from '@angular/core';
import {User} from '../_models/user.model';
import {Http} from '@angular/http'
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
        this.reset();


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
                return Promise.resolve(this.user);

            }).catch(reason => {
                return Promise.reject(reason.message || reason);
            });

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
        this.user.firstName = constants.DUMMY_FIRST_NAME;
        this.user.lastName = constants.DUMMY_LAST_NAME;
        return this.user;
    }

    getData() {
        return this.data;
    }

    reset() {
        this.data = {username: '', password: ''};
    }

}
