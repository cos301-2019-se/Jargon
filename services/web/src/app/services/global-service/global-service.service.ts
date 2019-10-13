import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../../interfaces/login-register/login-register';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  private currentTokenSubject: BehaviorSubject<string>;
  public currentToken: Observable<string>;

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor() {
    this.currentTokenSubject = new BehaviorSubject<string>(
        JSON.parse(localStorage.getItem('token')));
    this.currentToken = this.currentTokenSubject.asObservable();
    this.currentUserSubject = new BehaviorSubject<User>(
        Object.assign(new User, JSON.parse(localStorage.getItem('user'))));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public logout() {
    localStorage.removeItem('token');
    this.currentTokenSubject.next(null);
    this.currentUserSubject.next(null);
  }

  public getTokenValue(): string {
    return this.currentTokenSubject.value;
  }

  public setTokenValue(token: string) {
    localStorage.setItem('token', JSON.stringify(token));
    this.currentTokenSubject.next(token);
  }

  public getUserValue(): User {
    return this.currentUserSubject.value;
  }

  public setUserValue(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
