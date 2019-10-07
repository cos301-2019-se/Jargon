import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalService } from '../global-service/global-service.service';
import { LoginDetails } from '../../interfaces/login-register/login-register';
import { ApiResponse } from '../../interfaces/api-response/api-response';

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
        (response: ApiResponse) => {
          console.log("LoginApiRequester:",response);
          if (response && response.success && response.result.token) {
            // store jwt token in local storage to keep user logged in between page refreshes
            this.globalService.setTokenValue(response.result.token);
            this.globalService.setUserValue(response.result.user);
          }

          return response;
        }
      )
    );
  }
}
