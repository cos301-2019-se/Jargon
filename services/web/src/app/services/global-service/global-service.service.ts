import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  private currentTokenSubject: BehaviorSubject<string>;
  public currentToken: Observable<string>;

  private currentAdminSubject: BehaviorSubject<boolean>;
  public currentAdmin: Observable<boolean>;

  constructor() {
    this.currentTokenSubject = new BehaviorSubject<string>(localStorage.getItem('token'));
    this.currentToken = this.currentTokenSubject.asObservable();
    this.currentAdminSubject = new BehaviorSubject<boolean>(false);
    this.currentAdmin = this.currentAdminSubject.asObservable();
  }

  public logout() {
    localStorage.removeItem('token');
    this.currentTokenSubject.next(null);
    this.currentAdminSubject.next(null);
  }

  public getTokenValue(): string {
    return this.currentTokenSubject.value;
  }

  public setTokenValue(token: string) {
    localStorage.setItem('token', JSON.stringify(token));
    this.currentTokenSubject.next(token);
  }

  public getAdminValue(): boolean {
    return this.currentAdminSubject.value;
  }

  public setAdminValue(admin: boolean) {
    this.currentAdminSubject.next(admin);
  }
}
