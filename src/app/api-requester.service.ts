import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {HttpParams} from  "@angular/common/http";
import { Projects } from './projects';

@Injectable({
  providedIn: 'root'
})

export class ApiRequesterService {
  apiURL: string = 'http://localhost:3000';
  public firstPage: string = "";
  public prevPage: string = "";
  public nextPage: string = "";
  public lastPage: string = "";

  constructor(private httpClient: HttpClient) {}

  public getProjects(){
    return this.httpClient.get(`${this.apiURL}/projects`);
  }

  public createProject(name: string, type: string){

  }

  public searchProject(project: Projects, name: string, type: string){

  }

  public updateProject(id: string, list: string[]){
    console.log(this.httpClient.get(`${this.apiURL}/projects/edit`));
  }

  public deleteProject(name: string, type: string){

  }

  public getTweets(){
    return this.httpClient.get(`${this.apiURL}/projects`);
  }
}