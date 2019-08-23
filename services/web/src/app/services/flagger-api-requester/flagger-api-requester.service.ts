import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FlagData } from '../../interfaces/flagger/flag-data';

@Injectable({
  providedIn: 'root'
})
export class FlaggerApiRequesterService {
  apiURL = 'http://localhost:3002';

  constructor(private httpClient: HttpClient) {}

  public flagData(flaggedData: FlagData[]) {
    const body = {
      tweets: [
        ...flaggedData
      ]
    };
    return this.httpClient.post(`${this.apiURL}/flag/add`, body);
  }
}
