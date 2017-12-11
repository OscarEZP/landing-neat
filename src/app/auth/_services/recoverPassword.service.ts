import {Injectable} from '@angular/core';
import {User} from '../_models/user.model';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {StatusError} from '../_models/statusError.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class RecoverPasswordService {

    private redirectUrl: string;
    private recoverUrl: string;
    public data: {username: string, password: string, confirmPassword: string, verificationCode: string, destination: string };

    constructor(private http: Http) {
        this.redirectUrl = '/login';
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
        const user = new User();
        user.userName = username;
        return this.http
            .post(environment.apiUrl + environment.paths.forgotPassword, JSON.stringify(user))
            .toPromise()
            .then(
                value => {
                    this.data = value.json();
                    return Promise.resolve(this.data.destination);
                }
            ).catch(reason => {
                const error: StatusError = reason.json();
                return Promise.reject(error.message);
            });

    }

    changePassword(username: string, password: string, verificationCode: string): Promise<boolean> {
        const user = new User();
        user.userName = username;
        user.newPassword = password;
        user.confirmationCode = verificationCode;

        return this.http
            .post(environment.apiUrl + environment.paths.confirmForgotPassword, JSON.stringify(user))
            .toPromise()
            .then(value => {
                const status: boolean = value.json();
                return Promise.resolve(status);

            }).catch(reason => {
                const error: StatusError = reason.json();
                return Promise.reject(error.message);
            });
    }

}
