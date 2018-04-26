import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { User } from '../../shared/_models/user/user';
import { StorageService } from '../../shared/_services/storage.service';
import { ApiRestService } from '../../shared/_services/apiRest.service';
import { ManagementUser } from '../../shared/_models/management/managementUser';
import {Module} from '../../shared/_models/management/module';

@Injectable()
export class AuthService {

    static HEMICYCLE_GROUP_NAME = 'mcp_hemicycle';
    static HEMICYCLE_URL = '/hemicycle/contingencies';
    static LOGIN_ENDPOINT = 'login';
    static MANAGEMENT_USERS_ENDPOINT = 'managementUsers';
    static MANAGEMENT_ENDPOINT = 'management';
    static USER_MODE = 'user';
    static ADMIN_MODE = 'admin';

    private isLoggedIn: boolean;
    private redirectUrl: string;
    private loginUrl: string;
    public data: { username: string, password: string };
    private _apiService: ApiRestService;
    private _modulesConfig: { code: string, module: string }[];

    constructor(
        private http: HttpClient,
        private _storageService: StorageService
    ) {
        this.isLoggedIn = this.getIsLoggedIn();
        this.redirectUrl = '/operations';
        this.loginUrl = '/login';
        this.reset();
        this.apiService = new ApiRestService(this.http);
        this.modulesConfig = [
            {
                code: 'OP',
                module: 'operations'
            },
            {
                code: 'FH',
                module: 'fleet-health'
            },
            {
                code: 'GE',
                module: 'general'
            }
        ];
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
        this._storageService.removeCurrentUser();
        this._storageService.removeUserManagement();
    }

    getRoles(username: string): Promise<any> {
        return this.apiService
            .getParams<ManagementUser>(AuthService.MANAGEMENT_USERS_ENDPOINT, username)
            .toPromise()
            .then((res: ManagementUser) => {
                this.userManagement = res;
                return Promise.resolve(res);
            }).catch((reason: HttpErrorResponse) => {
                return Promise.reject(reason.error.message);
            }
        );
    }

    getIsAuth(path: string): boolean {
        const arrSegments = path.split('/').filter(x => x !== '');
        const segment = arrSegments.shift();
        if (this.userManagement && this.userManagement.modules.length !== 0) {
            let find = this.findModule(segment);
            if (!find && segment === AuthService.MANAGEMENT_ENDPOINT) {
                find = this.findModule(arrSegments.shift());
            }
            if (!find && segment !== AuthService.MANAGEMENT_ENDPOINT) {
                return false;
            }
            const result = segment === AuthService.MANAGEMENT_ENDPOINT ?
                !!this.userManagement.modules.find(m => !!m.roles.find(r => r === AuthService.ADMIN_MODE)) :
                !!find.roles.find(r => r === AuthService.USER_MODE || r === AuthService.ADMIN_MODE);
            return result;
        } else {
            return false;
        }
    }

    private findModule(segment: string): Module {
        return this.userManagement.modules
            .find(
                module => {
                    const configFind = this.modulesConfig.find(config => segment === config.module);
                    return configFind ? configFind.code === module.code : false;
                }
            );
    }

    getIsLoggedIn(): boolean {
        return this._storageService.hasCurrentUser();
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

    get userManagement(): ManagementUser {
        return this._storageService.userManagement;
    }

    set userManagement(value: ManagementUser) {
        this._storageService.userManagement = value;
    }

    get modulesConfig(): { code: string; module: string }[] {
        return this._modulesConfig;
    }

    set modulesConfig(value: { code: string; module: string }[]) {
        this._modulesConfig = value;
    }
}
