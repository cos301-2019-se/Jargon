import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Project } from '../../interfaces/project/project';

@Injectable({
  providedIn: 'root'
})
export class SharedAdminService {

  private projectsSubject: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>(null);
  projects: Observable<Project[]> = this.projectsSubject.asObservable();

  // private projectsSource: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>(null);
  // projects: Observable<Project[]> = this.projectsSource.asObservable();

  // private hideSource: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  // hide: Observable<boolean> = this.hideSource.asObservable();

  constructor() {
  }

  setProjects(projects: Project[]) {
    this.projectsSubject.next(projects);
  }

  getProjects(): Project[] {
    return this.projectsSubject.value;
  }
  
}
