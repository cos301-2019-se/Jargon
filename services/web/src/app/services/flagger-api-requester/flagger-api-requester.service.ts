import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FlagData } from '../../interfaces/flagger/flag-data';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FlaggerApiRequesterService {

  apiURL = environment.urlFlagger;

  constructor(private httpClient: HttpClient) {}

  public flagData(flaggedData: FlagData[]) {
    const body = {
      tweets: [
        ...flaggedData
      ]
    };
    return this.httpClient.post(`${this.apiURL}/add`, body);
  }
}
