import { Injectable } from '@angular/core';
import { User } from '../_models/user.model';
import 'rxjs/add/operator/toPromise';
import { ApiRestService } from '../../shared/_services/apiRest.service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class RecoverPasswordService {

    private redirectUrl: string;
    private recoverUrl: string;
    public data: {username: string, password: string, confirmPassword: string, verificationCode: string, destination: string };
    private _apiService: ApiRestService;

    constructor(
        private http: HttpClient,
        private _translate: TranslateService,
    ) {
        this.translate.setDefaultLang('en');
        this.redirectUrl = '/login';
        this.recoverUrl = '/recoverPassword';
        this.reset();
        this.apiService = new ApiRestService(this.http);
    }

    get translate(): TranslateService {
        return this._translate;
    }

    set translate(value: TranslateService) {
        this._translate = value;
    }

    get apiService(): ApiRestService {
        return this._apiService;
    }

    set apiService(value: ApiRestService) {
        this._apiService = value;
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
        user.username = username;
        return this.apiService
            .search('forgotPassword', user)
            .toPromise()
            .then(
                value => {
                    this.data.destination = value['destination'] ? value['destination'] : this.data.destination;
                    return Promise.resolve(this.data.destination);
                }
            ).catch(reason => {
                return Promise.reject(reason.error.message);
            });

    }

    changePassword(username: string, password: string, verificationCode: string): Promise<boolean> {
        const user = new User();
        user.username = username;
        user.newPassword = password;
        user.confirmationCode = verificationCode;

        return this.apiService
            .search('confirmForgotPassword', user)
            .toPromise()
            .then(value => {
                const status: boolean = !value['statusChangePassword'] ? value['statusChangePassword'] : false;
                return Promise.resolve(status);
            }).catch(reason => {
                return Promise.reject(reason.error.message);
            });
    }

}
