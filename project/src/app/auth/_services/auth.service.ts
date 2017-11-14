import {Injectable} from '@angular/core';
import {User} from '../_models/user.model';

@Injectable()
export class AuthService {

  private isLoggedIn:boolean;
  private redirectUrl:string;
  private loginUrl:string;
  private user:User;

  constructor(){
    this.isLoggedIn = this.getIsLoggedIn();
    this.redirectUrl = '/dashboard';
    this.loginUrl = '/login';
  }

  logIn() {
    this.isLoggedIn = true;
    localStorage.setItem('currentUser', 'admin');
  }

  logOut(){
    this.isLoggedIn = false;
    localStorage.removeItem('currentUser');
  }

  getIsLoggedIn(){
    return localStorage.getItem('currentUser') ? true : false
  }

  getRedirectUrl(): string {
    return this.redirectUrl;
  }
  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }
  getLoginUrl(): string {
    return this.loginUrl;
  }

}
