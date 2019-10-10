import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../services/global-service/global-service.service';
import { AdminApiRequesterService } from '../../../services/admin-api-requester/admin-api-requester.service';
import { Project } from '../../../interfaces/project/project';
import { SharedAdminProjectService } from '../../../services/shared-admin-project/shared-admin-project.service';
import { ApiResponse } from '../../../interfaces/api-response/api-response';

@Component({
  selector: 'app-admin-manage-projects',
  templateUrl: './admin-manage-projects.component.html',
  styleUrls: ['./admin-manage-projects.component.css']
})
export class AdminManageProjectsComponent implements OnInit {

  projects: Project[] = null;
  selected: number = 0;
  loading: boolean = false;

  projectsLength: number = 0;
  pageProjects: Project[] = [];
  pageIndex: number = 1;
  pages: number[] = [];

  hide: boolean = true;

  PAGE_SIZE: number = 5;

  constructor(private sharedAdminProjectService: SharedAdminProjectService,
    private adminApiRequester: AdminApiRequesterService) {}

  ngOnInit() {
    this.sharedAdminProjectService.projects.subscribe(
      (projects: Project[]) => {
        this.projects = [];
        if (projects != null) {
          this.projects = projects;
        }
        this.setPagination();
      }
    );
    this.projects = this.sharedAdminProjectService.getProjects();
    console.log("Projects:", this.projects);
    this.pageIndex = 1;
    if (this.projects === null) {
      this.onRefreshProjectsClick();
    } else {
      this.pages = [];
      this.projectsLength = this.projects.length/this.PAGE_SIZE;

      this.setPagination();
  
      this.pageProjects = [];
      for (let i = 0; i < this.PAGE_SIZE && i < this.projects.length; ++i) {
        this.pageProjects.push(this.projects[i]);
      }
    }
    console.log(this.projects);
  }

  setProject(project: Project) {
    this.sharedAdminProjectService.setCurrentProject(project);
  }

  onRefreshProjectsClick() {
    this.loading = true;
    this.projects = null;
    this.adminApiRequester.basicAllProjects().subscribe(
      (response: ApiResponse) => {
        console.log(response);
        this.pages = [];
        this.sharedAdminProjectService.setProjects(response.result);
        this.projects = this.sharedAdminProjectService.getProjects();
        this.loading = false;
      },
      error => {
        console.log("Error:", error);
        this.loading = false;
        this.projects = [];
      }
    );
  }

  onNextClick() {
    const MAX_PAGE = Math.ceil(this.projects.length/this.PAGE_SIZE);
    if (this.pageIndex + 1 <= MAX_PAGE) {
      this.pageIndex++;
      this.setPagination();
    }
  }

  onPreviousClick() {
    console.log("Page Index:", this.pageIndex);
    if (this.pageIndex - 1 >= 1) {
      this.pageIndex--;
      this.setPagination();
    }
  }

  onPageClick(index: number) {
    if (this.pageIndex >= 1 && this.pageIndex < this.projects.length/this.PAGE_SIZE) {
      this.pageIndex = <number>index;
      this.setPagination();
    }
  }

  private setPagination() {
    const MAX_PAGE = Math.ceil(this.projects.length/this.PAGE_SIZE);
    this.pages = [];
    let index = this.pageIndex;
    if (index == MAX_PAGE) {
      index -= 4;
    } else if (index == MAX_PAGE - 1) {
      index -= 3;
    } else if (index == MAX_PAGE - 2) {
      index -= 2;
    } else {
      index -= 2;
    }
    if (index < 1) {
      index = 1;
    }
    for (let i = index, count = 0; i <= MAX_PAGE && count < 5; ++i, ++count) {
      this.pages.push(i);
    }
    console.log("Pages:",this.pages);
    this.pageProjects = [];
    for (let i = (this.pageIndex-1) * this.PAGE_SIZE, count = 0; count < this.PAGE_SIZE && i < this.projects.length; ++i, ++count) {
      this.pageProjects.push(this.projects[i]);
    }
    console.log("Projects Per Page:", this.pageProjects);
  }

}
