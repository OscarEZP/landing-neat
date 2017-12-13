import {Injectable} from '@angular/core';
import { Group } from '../../shared/_models/user/group';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { User } from '../../shared/_models/user/user';
import {StatusError} from '../_models/statusError.model';
import {StorageService} from '../../shared/_services/storage.service';
import {environment} from '../../../environments/environment';

@Injectable()
export class AuthService {

    private isLoggedIn: boolean;
    private redirectUrl: string;
    private loginUrl: string;
    public data: { userName: string, password: string };


    constructor(private http: Http, private storageService: StorageService) {
        this.isLoggedIn = this.getIsLoggedIn();
        this.redirectUrl = '/operations';
        this.loginUrl = '/login';
        this.reset();
    }

    logIn(userName: string, password: string): Promise<User> {

        const user: User = new User();
        user.userName = userName;
        user.password = password;

        return this.http
            .post(environment.apiUrl + environment.paths.login, JSON.stringify(user).replace(/\b[_]/g, ''))
            .toPromise()
            .then(value => {
                const response = value.json();

                let i: number;
                const groups = [];

                user.userName = response.userName;
                user.email = response.email;
                user.firstName = response.firstName;
                user.givenName = response.givenName;
                user.idToken = response.idToken;
                user.lastName = response.lastName;
                user.phoneNumber = response.phoneNumber;
                user.userId = response.userId;
                user.userName = response.userName;
                user.password = null;

                for (i = 0; i < response.groupList.length; i++) {
                    if (response.groupList[i].name === 'MOC_Hemicycle') {
                        this.redirectUrl = '/hemicycle/contingencies';
                    }
                    groups.push(new Group(response.groupList[i].description, response.groupList[i].level, response.groupList[i].name));
                }

                user.groupList = groups;

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
        this.data = {userName: '', password: ''};
    }

}
