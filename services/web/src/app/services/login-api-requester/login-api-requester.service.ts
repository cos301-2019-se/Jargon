import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalService } from '../global-service/global-service.service';
import { LoginDetails } from '../../interfaces/login-register/login-register';

@Injectable({
  providedIn: 'root'
})
export class LoginApiRequesterService {

  apiURL = 'http://localhost:3000';
  constructor(private httpClient : HttpClient, 
      private globalService: GlobalService) {}

  public login(loginDetails: LoginDetails) {
    return this.httpClient.post(`${this.apiURL}/login`, loginDetails)
    .pipe(
      map(
        (res: any) => {
          if (res && res.token) {
            // store jwt token in local storage to keep user logged in between page refreshes
            this.globalService.setTokenValue(res.token);
            this.globalService.setAdminValue(res.admin);
          }

          return res;
        }
      )
    );
  }
}
