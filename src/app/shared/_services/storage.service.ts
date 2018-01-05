import {Injectable} from '@angular/core';
import { User } from '../_models/user/user';

@Injectable()
export class StorageService {
    private static RECOVER_ACCOUNT = 'recoverAccount';
    private static RECOVER_DESTINATION = 'recoverDestination';
    private static CURRENT_USER = 'currentUser';

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

}
