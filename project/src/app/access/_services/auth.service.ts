import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

  isLogged:boolean;

  constructor(){
    this.isLogged = sessionStorage.getItem('currentUser') ? true : false;
  }

  logIn() {
    this.isLogged = true;
    sessionStorage.setItem('currentUser', 'admin');
  }

  logOut(){
    this.isLogged = false;
    sessionStorage.removeItem('currentUser');
  }

}
