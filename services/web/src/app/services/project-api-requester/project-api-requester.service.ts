import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Projects } from '../../shared/project/projects';
import { Project } from '../../interfaces/project/project';

@Injectable({
  providedIn: 'root'
})

export class ProjectApiRequesterService {
  apiURL = 'http://127.0.0.1:3000';
  public firstPage = '';
  public prevPage = '';
  public nextPage = '';
  public lastPage = '';

  constructor(private httpClient: HttpClient) {}
 
  public getProjectsBasic() {
    return this.httpClient.get(`${this.apiURL}/projects/basicTokenized`);
  }

  public getProjectsDetailed() {
    return this.httpClient.get(`${this.apiURL}/projects/detailedTokenized`);
  }

  public getProjectDetailed(id: string) {
    return this.httpClient.post(`${this.apiURL}/projects/detailedSearchTokenized`, { id: id });
  }

  public createProject(project: Project) {
    return this.httpClient.post(`${this.apiURL}/projects/createTokenized`, project);
  }

  public searchProject(project: Projects, name: string, type: string){

  }

  public startProject(project: Project) {
    const body = {
      id: project._id,
      platform: project.source
    }
    return this.httpClient.post(`${this.apiURL}/projects/startStreamTokenized`, body);
  }

  public updateProject(project: Project) {
    const updateValues = [
      {'propName': 'project_name', 'value': project.project_name},
      {'propName': 'whitelist', 'value': project.whitelist},
      {'propName': 'blacklist', 'value': project.blacklist},
      {'propName': 'trackTime', 'value': project.trackTime},
      {'propName': 'source', 'value': project.source},
    ];

    return this.httpClient.post(`${this.apiURL}/projects/editTokenized`, {
      'id': project._id,
      'updateValues' : updateValues
    });
  }

  public deleteProject(id: string) {
    return this.httpClient.post(`${this.apiURL}/projects/deleteTokenized`, {
      'id': id
    });
  }

  public getTweets(){
    return this.httpClient.get(`${this.apiURL}/projectsTokenized`);
  }

  public start(id: number) {
    return this.httpClient.post(`${this.apiURL}/projects/startTokenized`, {
      'id': id,
      'platform': 'twitter'
    });
  }

  public projectStatistics(id: string) {
    return this.httpClient.post('http://localhost:3004/analyse/getStatistics', {
      id: id
    });
  }

  public analyse(id: string) {
    return this.httpClient.post('http://localhost:3004/analyse', {
      id: id
    });
  }

}
