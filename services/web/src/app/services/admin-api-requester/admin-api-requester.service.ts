import { Injectable } from '@angular/core';
import { GlobalService } from '../global-service/global-service.service';
import { HttpClient } from '@angular/common/http';
import { RegisterDetails } from '../../interfaces/login-register/login-register';

@Injectable({
  providedIn: 'root'
})
export class AdminApiRequesterService {

  apiURL = 'http://localhost:3000';
  constructor(private httpClient : HttpClient, 
      private globalService: GlobalService) {}

  public createAdminUser(registerDetail: RegisterDetails) {
    return this.httpClient.post(`${this.apiURL}/createAdminUser`, registerDetail);
  }

  public deleteUser(userId: string) {
    const body = {
      id: userId
    };
    return this.httpClient.post(`${this.apiURL}/deleteUser`, body);
  }

  public basicAllProjects() {
    return this.httpClient.post(`${this.apiURL}/basicAllProjects`, {});
  }

  public detailedAllProjects() {
    return this.httpClient.post(`${this.apiURL}/detailedAllProjects`, {});
  }

  public detailedSearch(id: string) {
    const body = {
      id: id
    };
    return this.httpClient.post(`${this.apiURL}/detailedSearch`, body);
  }
}
