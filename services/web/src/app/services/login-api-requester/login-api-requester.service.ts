import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginApiRequesterService {

  apiURL = 'http://localhost:3000';
  constructor() { }
}
