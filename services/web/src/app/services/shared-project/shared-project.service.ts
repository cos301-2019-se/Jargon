import { Injectable } from '@angular/core';
import { Project } from '../../interfaces/project/project';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedProjectService {

  private projectSource: BehaviorSubject<Project> = new BehaviorSubject<Project>(null);
  project: Observable<Project> = this.projectSource.asObservable();

  private hideSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  hide: Observable<boolean> = this.hideSource.asObservable();

  constructor() {
  }

  setCurrentProject(proj: Project) {
    this.projectSource.next(proj);
  }

  setHide(hide: boolean) {
    this.hideSource.next(hide);
  }
}
