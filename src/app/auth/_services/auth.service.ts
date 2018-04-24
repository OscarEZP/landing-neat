import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { User } from '../../shared/_models/user/user';
import { StorageService } from '../../shared/_services/storage.service';
import { ApiRestService } from '../../shared/_services/apiRest.service';

@Injectable()
export class AuthService {

    static HEMICYCLE_GROUP_NAME = 'mcp_hemicycle';
    static HEMICYCLE_URL = '/hemicycle/contingencies';
    static LOGIN_ENDPOINT = 'login';
    static AUTH_ENDPOINT = '';

    private isLoggedIn: boolean;
    private redirectUrl: string;
    private loginUrl: string;
    public data: { username: string, password: string };
    private _apiService: ApiRestService;

    constructor(private http: HttpClient, private storageService: StorageService) {
        this.isLoggedIn = this.getIsLoggedIn();
        this.redirectUrl = '/operations';
        this.loginUrl = '/login';
        this.reset();
        this.apiService = new ApiRestService(this.http);
    }

    get apiService(): ApiRestService {
        return this._apiService;
    }

    set apiService(value: ApiRestService) {
        this._apiService = value;
    }

    logIn(username: string, password: string): Promise<User> {
        let user: User = new User();
        user.username = username;
        user.password = password;
        return this.apiService
            .search<User>(AuthService.LOGIN_ENDPOINT, user)
            .toPromise()
            .then((value: User) => {
                let i: number;
                user = value;
                for (i = 0; i < user.groupList.length; i++) {
                    if (user.groupList[i].name.toLocaleLowerCase() === AuthService.HEMICYCLE_GROUP_NAME.toLocaleLowerCase()) {
                        this.redirectUrl = AuthService.HEMICYCLE_URL;
                    }
                    user.principalGroup = user.groupList[i].name;
                }
                return Promise.resolve(user);
            }).catch((reason: HttpErrorResponse) => {
                return Promise.reject(reason.error.message);
            });
    }

    logOut(): void {
        this.isLoggedIn = false;
        this.storageService.removeCurrentUser();
    }

    /*getPermissions(): Promise<User> {
        this.apiService
            .search<User>(AuthService.AUTH_ENDPOINT, user)
            .toPromise()
            .then((value: User) => {
                return Promise.resolve(user);
            }).catch((reason: HttpErrorResponse) => {
            return Promise.reject(reason.error.message);
        });
    }*/

    getIsAuth(path: string): boolean {
        console.log(path);
        return true;
    }

    getIsLoggedIn(): boolean {
        return this.storageService.hasCurrentUser();
    }

    getRedirectUrl(): string {
        return this.redirectUrl;
    }

    getLoginUrl(): string {
        return this.loginUrl;
    }

    getData(): { username: string, password: string } {
        return this.data;
    }

    reset() {
        this.data = {username: '', password: ''};
    }

}
