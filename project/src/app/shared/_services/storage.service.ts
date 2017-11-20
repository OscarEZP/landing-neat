import {Injectable} from '@angular/core';
import {User} from "../../auth/_models/user.model";
import * as constants from '../../constants';

@Injectable()
export class StorageService {
    private static RECOVER_ACCOUNT: string = 'recoverAccount';
    private static RECOVER_DESTINATION: string = 'recoverDestination';
    private static CURRENT_USER: string = 'currentUser';

    constructor() {
    }


    private static removeLocalStorage(key: string) {
        localStorage.removeItem(key);

    }

    private static addLocalStorage(key: string, item: string) {
        localStorage.setItem(key, item);
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
        return localStorage.getItem(StorageService.CURRENT_USER) ? true : false;

    }

    public getCurrentUser(): User {
        let user: User = JSON.parse(localStorage.getItem(StorageService.CURRENT_USER));
        return user;
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

}