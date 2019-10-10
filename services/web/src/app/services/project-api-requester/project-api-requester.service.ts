import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Projects } from '../../shared/project/projects';
import { Project } from '../../interfaces/project/project';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ProjectApiRequesterService {
  
  apiURL = environment.urlProject;

  constructor(private httpClient: HttpClient) {}
 
  public getProjectsBasic() {
    return this.httpClient.post(`${this.apiURL}/basicTokenized`, {});
  }

  public getProjectsDetailed() {
    return this.httpClient.get(`${this.apiURL}/detailedTokenized`);
  }

  public getProjectDetailed(id: string) {
    return this.httpClient.post(`${this.apiURL}/detailedSearchTokenized`, { id: id });
  }

  public createProject(project: Project) {
    return this.httpClient.post(`${this.apiURL}/createTokenized`, project);
  }

  public searchProject(project: Projects, name: string, type: string){

  }

  public startProject(project: Project) {
    const body = {
      id: project._id,
      platform: project.source
    }
    return this.httpClient.post(`${this.apiURL}/startStreamTokenized`, body);
  }

  public updateProject(project: Project) {
    const updateValues = [
      {'propName': 'project_name', 'value': project.project_name},
      {'propName': 'whitelist', 'value': project.whitelist},
      {'propName': 'blacklist', 'value': project.blacklist},
      {'propName': 'trackTime', 'value': project.trackTime},
      {'propName': 'source', 'value': project.source},
    ];

    return this.httpClient.post(`${this.apiURL}/editTokenized`, {
      'id': project._id,
      'updateValues' : updateValues
    });
  }

  public getData(projectId: string, page: number, count: number){
    const body = {
      id: projectId,
      page: page,
      count: count
    };
    return this.httpClient.post(`${this.apiURL}/tweets`, body);
  }

  public deleteProject(id: string) {
    return this.httpClient.post(`${this.apiURL}/deleteTokenized`, {
      'id': id
    });
  }

  public getTweets(){
    return this.httpClient.get(`${this.apiURL}/projectsTokenized`);
  }

  public start(id: number) {
    return this.httpClient.post(`${this.apiURL}/startTokenized`, {
      'id': id,
      'platform': 'twitter'
    });
  }

}
