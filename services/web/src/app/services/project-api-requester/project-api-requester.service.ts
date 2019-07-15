import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Projects } from '../../shared/project/projects';

@Injectable({
  providedIn: 'root'
})

export class ProjectApiRequesterService {
  apiURL = 'http://localhost:3000';
  public firstPage = '';
  public prevPage = '';
  public nextPage = '';
  public lastPage = '';

  constructor(private httpClient: HttpClient) {}
 
  public getProjectsBasic() {
    return this.httpClient.get(`${this.apiURL}/projects/basic`);
  }

  public getProjectsDetailed() {
    return this.httpClient.get(`${this.apiURL}/projects/detailed`);
  }

  public createProject(project_name: string, source: string, whitelist: string[], blacklist: string[], track: number) {
    return this.httpClient.post(`${this.apiURL}/projects/create`, {
      'project_name': project_name, 'whitelist': whitelist, 'blacklist': blacklist, 'source': source, 'trackTime': track
    });
  }

  public searchProject(project: Projects, name: string, type: string){

  }

  public updateProject(id: number, name: string, source: string, track: number, whitelist: string[], blacklist: string[]) {
    const updateValues = [
      {'propName': 'project_name', 'value': name},
      {'propName': 'whitelist', 'value': whitelist},
      {'propName': 'blacklist', 'value': blacklist},
      {'propName': 'trackTime', 'value': track},
      {'propName': 'source', 'value': source},
    ];

    const array = [];
    array.push(updateValues);

    return this.httpClient.post(`${this.apiURL}/projects/edit`, {
      'id': id,
      'updateValues' : updateValues
    });
  }

  public deleteProject(id: number) {
    return this.httpClient.post(`${this.apiURL}/projects/delete`, {
      'id': id
    });
  }

  public getTweets(){
    return this.httpClient.get(`${this.apiURL}/projects`);
  }

  public  start(id: number) {
    return this.httpClient.post(`${this.apiURL}/projects/start`, {
      'id': id,
      'platform': 'twitter'
    });
  }
}
