import {Injectable} from '@angular/core';
import {User} from '../_models/user.model';
import {Http} from '@angular/http'
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

    getData() {
        return this.data;
    }

    findAccount(username: string): Promise<string> {
        let user = new User();
        user.userName = username;
        return this.http
            .post(constants.API_POST_FIND_ACCOUNT, JSON.stringify(user), this.headers)
            .toPromise()
            .then(
                value => {
                    this.data = value.json();
                    this.data.username = username;
                    return Promise.resolve(this.data.destination);
                }
            ).catch(reason => {
                return Promise.reject(reason.message || reason);
            });

    }

    changePassword(username: string, password: string, verificationCode: string): Promise<boolean> {
        let user = new User();
        user.userName = username;
        user.newPassword = password;
        user.confirmationCode = verificationCode;

        return this.http
            .post(constants.API_POST_CHANGE_PASSWORD, JSON.stringify(user), this.headers)
            .toPromise()
            .then(value => {
                let status:boolean=value.json();
                return Promise.resolve(status);
            }).catch(reason => {
                return Promise.reject(reason.message || reason);
            });

    }

}
