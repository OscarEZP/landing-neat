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
    private _redirectUrl: string;
    private loginUrl: string;
    public data: { username: string, password: string };
    private _modulesConfig: { code: string, module: string }[];

    constructor(
        private http: HttpClient,
        private _storageService: StorageService,
        private _apiService: ApiRestService
    ) {
        this.isLoggedIn = this.getIsLoggedIn();
        this._redirectUrl = '/operations';
        this.loginUrl = '/login';
        this.reset();
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

    /**
     * Login method that returns a promise with user object or an error reason
     * @param {string} username
     * @param {string} password
     * @returns {Promise<User>}
     */
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
                        this._redirectUrl = AuthService.HEMICYCLE_URL;
                    }
                    user.principalGroup = user.groupList[i].name;
                }
                return Promise.resolve(user);
            }).catch((reason: HttpErrorResponse) => {
                return Promise.reject(reason.error.message);
            });
    }

    /**
     * Logout of App
     */
    logOut(): void {
        this.isLoggedIn = false;
        this._storageService.removeCurrentUser();
        this._storageService.removeUserManagement();
    }

    /**
     * Get roles from API
     * @param {string} username
     * @returns {Promise<any>}
     */
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

    /**
     * Validate if a module link is valid for current user
     * @param {string} path
     * @returns {boolean}
     */
    getIsAuth(path: string): boolean {
        const arrSegments = path.split('/').filter(x => x !== '');
        const segment = arrSegments.shift();
        if (this.userManagement && this.userManagement.modules.length !== 0) {
            const find = this.findModule(segment);
            return find ?
                !!find.roles.find(r => r === AuthService.USER_MODE || r === AuthService.ADMIN_MODE) :
                this.getIsAuthSubModule(segment, arrSegments);
        } else {
            return false;
        }
    }

    /**
     * Validate if a submodule link is valid for current user
     * @param {string} segment
     * @param {string[]} arrSegments
     * @returns {boolean}
     */
    getIsAuthSubModule(segment: string, arrSegments: string[]): boolean {
        if (segment === AuthService.MANAGEMENT_ENDPOINT) {
            const find = this.findModule(arrSegments.shift());
            return find ? !!find.roles.find(r => r === AuthService.ADMIN_MODE) : false;
        } else {
            return false;
        }
    }

    /**
     * Find a module by a code
     * @param {string} segment
     * @returns {Module}
     */
    private findModule(segment: string): Module {
        return this.userManagement.modules
            .find(
                module => {
                    const configFind = this.modulesConfig.find(config => segment === config.module);
                    return configFind && configFind.code === module.code;
                }
            );
    }

    getIsLoggedIn(): boolean {
        return this._storageService.hasCurrentUser();
    }

    getRedirectUrl(): string {
        return this._redirectUrl;
    }

    setRedirectUrl(value: string) {
        this._redirectUrl = value;
    }

    getLoginUrl(): string {
        return this.loginUrl;
    }

    getHemicycleGroupName() {
        return AuthService.HEMICYCLE_GROUP_NAME;
    }

    getHemicycleUrl() {
        return AuthService.HEMICYCLE_URL;
    }

    getData(): { username: string, password: string } {
        return this.data;
    }

    reset() {
        this.data = {username: '', password: ''};
    }

    get apiService(): ApiRestService {
        return this._apiService;
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
