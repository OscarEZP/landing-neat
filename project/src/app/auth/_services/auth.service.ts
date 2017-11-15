import {Injectable} from '@angular/core';
import {User} from '../_models/user.model';
import {Observable} from 'rxjs';
import {Http} from '@angular/http';

@Injectable()
export class AuthService {

  private isLoggedIn: boolean;
  private redirectUrl: string;
  private loginUrl: string;
  private user: User;
  private clock: Observable<Date>;

  constructor(private http:Http){
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

  findAccount(username: String){
    console.log(username);
    this.http.post('https://api.github.com/users/seeschweiler', {'user': username}).subscribe(data => {
      console.log(data);
    });
  }

  changePassword(){

  }

}
