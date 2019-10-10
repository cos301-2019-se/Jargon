import { Injectable } from '@angular/core';
import { Project } from '../../interfaces/project/project';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedProjectService {

  private projectSource: BehaviorSubject<Project> = new BehaviorSubject<Project>(null);
  project: Observable<Project> = this.projectSource.asObservable();

  // private projectsSource: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>(null);
  // projects: Observable<Project[]> = this.projectsSource.asObservable();

  // private projects: Project[] = null;
  private projectsSource: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>(null);
  projects: Observable<Project[]> = this.projectsSource.asObservable();

  constructor() {
  }

  setCurrentProject(proj: Project) {
    this.projectSource.next(proj);
  }

  getCurrentProject() {
    return this.projectSource.value;
  }

  setProjects(projects: Project[]) {
    this.projectsSource.next(projects);
  }

  getProjects(): Project[] {
    return this.projectsSource.value;
  }

}
