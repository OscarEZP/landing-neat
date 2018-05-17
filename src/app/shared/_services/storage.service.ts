import {Injectable} from '@angular/core';
import { User } from '../_models/user/user';
import {ManagementUser} from '../_models/management/managementUser';
import {Station} from '../_models/management/station';

@Injectable()
export class StorageService {
    private static RECOVER_ACCOUNT = 'recoverAccount';
    private static RECOVER_DESTINATION = 'recoverDestination';
    private static CURRENT_USER = 'currentUser';
    private static USER_MANAGEMENT = 'userManagement';
    private static USER_ATEC_FILTER = 'userAtecFilter';
    constructor() {
    }

    private static removeLocalStorage(key: string) {
        localStorage.removeItem(key);
    }

    private static addLocalStorage(key: string, item: string) {
        localStorage.setItem(key, item);
    }

    private static getLocalStorage(key: string) {
        return localStorage.getItem(key);
    }

    private static removeSessionStorage(key: string) {
        sessionStorage.removeItem(key);
    }

    private static addSessionStorage(key: string, item: string) {
        sessionStorage.setItem(key, item);
    }

    private static getSessionStorage(key: string): string {
        return sessionStorage.getItem(key);
    }

    public addCurrentUser(user: User) {
        StorageService.addLocalStorage(StorageService.CURRENT_USER, JSON.stringify(user));
    }

    public removeCurrentUser() {
        StorageService.removeLocalStorage(StorageService.CURRENT_USER);
    }

    public hasCurrentUser(): boolean {
        return !!localStorage.getItem(StorageService.CURRENT_USER);
    }

    public getCurrentUser(): User {
        return Object.assign(new User(), JSON.parse(localStorage.getItem(StorageService.CURRENT_USER)));
    }

    public updateCurrentUserTokens(accessToken: string, idToken: string): void {
        const user = this.getCurrentUser();
        user.accessToken = accessToken;
        user.idToken = idToken;

        this.removeCurrentUser();
        this.addCurrentUser(user);
    }

    public addRecoverPassword(username: string, destination: string) {
        StorageService.addSessionStorage(StorageService.RECOVER_ACCOUNT, username);
        StorageService.addSessionStorage(StorageService.RECOVER_DESTINATION, destination);
    }

    public getRecoverAccount(): string {
        return StorageService.getSessionStorage(StorageService.RECOVER_ACCOUNT);
    }

    public getRecoverDestination(): string {
        return StorageService.getSessionStorage(StorageService.RECOVER_DESTINATION);
    }


    public removeRecoverPassword() {
        StorageService.removeSessionStorage(StorageService.RECOVER_ACCOUNT);
        StorageService.removeSessionStorage(StorageService.RECOVER_DESTINATION);
    }

    get username(): string {
        return this.getCurrentUser().username;
    }

    set userManagement(value: any) {
        StorageService.addLocalStorage(StorageService.USER_MANAGEMENT, JSON.stringify(value));
    }

    get userManagement(): any {
        return Object.assign(ManagementUser.getInstance(), JSON.parse(StorageService.getLocalStorage(StorageService.USER_MANAGEMENT)));
    }
    set userAtecFilter(value: any) {
        StorageService.addLocalStorage(StorageService.USER_ATEC_FILTER, JSON.stringify(value));
    }

    get userAtecFilter(): any {
        return Object.assign(ManagementUser.getInstance(), JSON.parse(StorageService.getLocalStorage(StorageService.USER_ATEC_FILTER)));
    }
    public removeUserManagement() {
        StorageService.removeLocalStorage(StorageService.USER_MANAGEMENT);
    }
    public removeUserAtecFilter() {
        StorageService.removeLocalStorage(StorageService.USER_ATEC_FILTER);
    }
    get userStations(): Station[] {
        let result = [];
        result.push(this.userManagement.detailStation.defaults);
        result = result.concat(this.userManagement.detailStation.others);
        return result;
    }
    get userDefaultStation(): Station {
      return  this.userManagement.detailStation.defaults;
    }
}
