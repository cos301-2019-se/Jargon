import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AnalyseApiRequesterService {

  apiUrl: string = environment.urlAnalyse;

  constructor(private httpClient: HttpClient) { }

  public projectStatistics(id: string) {
    return this.httpClient.post(`${this.apiUrl}/getStatistics`, {
      id: id
    });
  }

  public analyse(id: string) {
    return this.httpClient.post(`${this.apiUrl}`, {
      id: id
    });
  }

  public getUserStatistics(id: string) {
    return this.httpClient.post(`${this.apiUrl}/getUserStatistics`, {
      id: id
    });
  }

  public getProjectStatistics() {
    return this.httpClient.post(`${this.apiUrl}/getProjectStatistics`, {});
  }
}
