import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginApiRequesterService {

  apiURL = 'http://localhost:3000';
  constructor(private httpClient : HttpClient) { }

  public authenticateUser(email : string, password : string)
  {
    return this.httpClient.post(`${this.apiURL}/login`, {
      'email': email, 'password': password
    });
  }
}
