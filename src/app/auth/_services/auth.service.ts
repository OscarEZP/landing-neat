import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/_models/user/user';
import { StorageService } from '../../shared/_services/storage.service';
import { StatusError } from '../_models/statusError.model';

@Injectable()
export class AuthService {

    private isLoggedIn: boolean;
    private redirectUrl: string;
    private loginUrl: string;
    public data: { username: string, password: string };


    constructor(private http: HttpClient, private storageService: StorageService) {
        this.isLoggedIn = this.getIsLoggedIn();
        this.redirectUrl = '/operations';
        this.loginUrl = '/login';
        this.reset();
    }

    logIn(username: string, password: string): Promise<User> {

        let user: User = new User();
        user.username = username;
        user.password = password;

        return this.http
            .post<User>(environment.apiUrl + environment.paths.login, JSON.stringify(user).replace(/\b[_]/g, ''))
            .toPromise()
            .then((value: User) => {

                let i: number;

                user = value;

                for (i = 0; i < user.groupList.length; i++) {
                    if (user.groupList[i].name === 'MOC_Hemicycle') {
                        this.redirectUrl = '/hemicycle/contingencies';
                    }
                    user.principalGroup = user.groupList[i].name;
                }

                return Promise.resolve(user);
            }).catch(reason => {
                const error: StatusError = reason.json();
                return Promise.reject(error.message);
            });

    }

    logOut() {
        this.isLoggedIn = false;
        this.storageService.removeCurrentUser();
    }

    getIsLoggedIn() {
        return this.storageService.hasCurrentUser();
    }

    getRedirectUrl(): string {
        return this.redirectUrl;
    }

    getLoginUrl(): string {
        return this.loginUrl;
    }

    getData() {
        return this.data;
    }

    reset() {
        this.data = {username: '', password: ''};
    }

}
