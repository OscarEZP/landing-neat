import {Injectable} from '@angular/core';
import {User} from '../_models/user.model';
import {Http, Response} from '@angular/http'
import 'rxjs/add/operator/toPromise';
import * as constants from '../../constants';

@Injectable()
export class RecoverPasswordService {

    private redirectUrl: string;
    private recoverUrl: string;
    private headers: Headers;
    private data: { username: string, password: string, confirmPassword: string, verificationCode: string, destination: string };

    constructor(private http: Http) {
        this.headers = new Headers({'Content-Type': 'application/json'});
        this.redirectUrl = '/dashboard';
        this.recoverUrl = '/recoverPassword';
        this.reset();

    }

    getRedirectUrl(): string {
        return this.redirectUrl;
    }

    getRecoverUrl(): string {
        return this.recoverUrl;
    }

    reset() {
        this.data = {username: '', password: '', confirmPassword: '', verificationCode: '', destination: ''};
    }

    getUsername(): string {
        return this.data.username;
    }

    getData() {
        return this.data;
    }

    findAccount(username: string): Promise<string> {
        let user = new User();
        user.userName = username;
        return this.http
            .post(constants.API_POST_FIND_ACCOUNT, JSON.stringify(user), this.headers)
            .toPromise()
            .then(value => {
                    this.extractData(value);
                }
            ).catch(this.handleError);
    }

    changePassword(username: string, password: string, verificationCode: string): Promise<true> {
        let user = new User();
        user.userName = username;
        user.newPassword = password;
        user.confirmationCode = verificationCode;

        return this.http
            .post(constants.API_POST_CHANGE_PASSWORD, JSON.stringify(user), this.headers)
            .toPromise()
            .then(this.extractData).catch(this.handleError);

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
