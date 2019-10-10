import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GlobalService } from '../global-service/global-service.service';
import { RegisterDetails } from '../../interfaces/login-register/login-register';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterApiRequesterService {

  apiURL = environment.urlRegister;
  
  constructor(private httpClient : HttpClient, 
      private globalService: GlobalService) {}

  public register(registerDetails: RegisterDetails) {
    return this.httpClient.post(`${this.apiURL}`, registerDetails);
  }
}
