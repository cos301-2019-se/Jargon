import { Injectable } from '@angular/core';
import { Project } from '../../interfaces/project/project';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedProjectService {

  private projectSource: BehaviorSubject<Project> = new BehaviorSubject<Project>(null);
  project: Observable<Project> = this.projectSource.asObservable();

  constructor() {
  }

  setCurrentProject(proj: Project) {
    this.projectSource.next(proj);
  }
}
