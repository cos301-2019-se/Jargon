import { Injectable } from '@angular/core';
import { HttpClient } from 'selenium-webdriver/http';

@Injectable({
  providedIn: 'root'
})
export class LoginApiRequesterService {

  apiURL = 'http://localhost:3000';
  constructor(httpClient : HttpClient) { }

  public authenticateUser(username : string, password : string)
  {
    return this.httpClient.post(`${this.apiURL}/user/login`, {
      'project_name': project_name, 'whitelist': whitelist, 'blacklist': blacklist, 'source': source, 'trackTime': track
    });
  }
}
