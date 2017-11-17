import {Injectable} from '@angular/core';
import {User} from "../../auth/_models/user.model";
import * as constants from '../../constants';

@Injectable()
export class StorageService {
    private static RECOVER_ACCOUNT: string = 'recoverAccount';
    private static RECOVER_DESTINATION:string='recoverDestination';
    private static CURRENT_USER: string = 'currentUser';
    private static CURRENT_USER: string = 'currentUser';
    constructor() {
    }


    private removeLocalStorage(key: string) {
        localStorage.removeItem(key);

    }

    private addLocalStorage(key: string, item: string) {

        localStorage.setItem(key, item);
    }

    private removeSessionStorage(key: string) {
        sessionStorage.removeItem(key);

    }

    private addSessionStorage(key: string, item: string) {
        sessionStorage.setItem(key, item);
    }

    private getSessionStorage(key: string) {
        sessionStorage.getItem(key);
    }

    public addCurrentUser(user: User) {
        this.addLocalStorage(StorageService.CURRENT_USER, JSON.stringify(user));
    }

    public removeCurrentUser() {
        this.removeLocalStorage(StorageService.CURRENT_USER);;
    }

    public hasCurrentUser(): boolean {
        return localStorage.getItem(StorageService.CURRENT_USER) ? true : false;

    }

    public getCurrentUser(): User {

        let user: User = JSON.parse(localStorage.getItem(StorageService.CURRENT_USER))
        user.firstName = constants.DUMMY_FIRST_NAME;
        user.lastName = constants.DUMMY_LAST_NAME;

        return user;
    }

    addRecoverAccount(username: string) {
        this.addSessionStorage(StorageService.RECOVER_ACCOUNT, username);
    }

    getRecoverAccount():String {
       return this.getSessionStorage(StorageService.RECOVER_ACCOUNT);
    }

    addRecoverDestination(destination: string) {
        this.addSessionStorage(StorageService.RECOVER_DESTINATION, destination);
    }

    getRecoverDestination():String {
        return this.getSessionStorage(StorageService.RECOVER_DESTINATION);
    }


    removeRecoverPassword() {
        this.removeSessionStorage(StorageService.RECOVER_ACCOUNT);
        this.removeSessionStorage(StorageService.RECOVER_DESTINATION);
    }

}