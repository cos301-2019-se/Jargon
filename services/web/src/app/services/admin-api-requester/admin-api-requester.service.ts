import { Injectable } from '@angular/core';
import { GlobalService } from '../global-service/global-service.service';
import { HttpClient } from '@angular/common/http';
import { RegisterDetails, User } from '../../interfaces/login-register/login-register';
import { Project } from '../../interfaces/project/project';

@Injectable({
  providedIn: 'root'
})
export class AdminApiRequesterService {

  apiURL = 'http://127.0.0.1:3000/admin';
  constructor(private httpClient : HttpClient) {}

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

  public updateProject(project: Project) {
    return this.httpClient.post(`${this.apiURL}/updateProject`, project)
  }

  public deleteProject(projectId: string) {
    const body = {
      id: projectId
    };
    return this.httpClient.post(`${this.apiURL}//deleteProjectAdmin`, body);
  }

  public getUser() {
    const body = {};
    return this.httpClient.post(`${this.apiURL}/getUser`, body);
  }

  public getUsersAdmin() {
    const body = {};
    return this.httpClient.post(`${this.apiURL}/getUserAdmin`, body);
  }

  public editUser(user: User) {
    const body = {
      updateValues: [
        {'propName': 'name', 'value': user.name},
        {'propName': 'surname', 'value': user.surname},
        {'propName': 'email', 'value': user.email},
        {'propName': 'username', 'value': user.username},
        // {'propName': 'password', 'value': user.password},
        // {'propName': 'passwordConfirm', 'value': user.passwordConfirm}
      ]
    };
    return this.httpClient.post(`${this.apiURL}/editUser`, body);
  }

  public edituserAdmin(user: User) {
    const body = {
      updateValues: [
        {'propName': 'id', 'value': user.id},
        {'propName': 'name', 'value': user.name},
        {'propName': 'surname', 'value': user.surname},
        {'propName': 'email', 'value': user.email},
        {'propName': 'username', 'value': user.username},
        // {'propName': 'password', 'value': user.password},
        // {'propName': 'passwordConfirm', 'value': user.passwordConfirm}
      ]
    };
    return this.httpClient.post(`${this.apiURL}/editUserAdmin`, body);
  }
}
