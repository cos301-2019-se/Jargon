import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../services/global-service/global-service.service';
import { AdminApiRequesterService } from '../../../services/admin-api-requester/admin-api-requester.service';
import { Project } from '../../../interfaces/project/project';
import { SharedAdminProjectService } from '../../../services/shared-admin-project/shared-admin-project.service';

@Component({
  selector: 'app-admin-manage-projects',
  templateUrl: './admin-manage-projects.component.html',
  styleUrls: ['./admin-manage-projects.component.css']
})
export class AdminManageProjectsComponent implements OnInit {

  // projects: Project[] = null;

  constructor(private sharedAdminProjectService: SharedAdminProjectService,
      private adminApiRequester: AdminApiRequesterService) {}

  // ngOnInit() {
  //   this.adminApiRequester.basicAllProjects().subscribe(
  //     (res: any) => {
  //       console.log(res);
  //       this.projects = res.result;
  //     }
  //   );
  // }

  projects: Project[] = null;
  selected: number = 0;
  loading: boolean = false;

  projectsLength: number = 0;
  pageProjects: Project[] = [];
  pageIndex: number = 0;
  pages: number[] = [];

  hide: boolean = true;

  PAGE_SIZE: number = 5;

  ngOnInit() {
    if (this.projects === null) {
      this.onRefreshProjectsClick();
    } else {
      this.pages = [];
      this.projectsLength = this.projects.length/this.PAGE_SIZE;

      for (let i = 0; i < this.projects.length; i += this.PAGE_SIZE ) {
          this.pages.push(0);
      }
  
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
      (projects: Project[]) => {
        console.log(projects);
        this.pages = [];
        this.sharedAdminProjectService.setProjects(projects);
        this.projects = this.sharedAdminProjectService.getProjects();
        this.projectsLength = this.projects.length/this.PAGE_SIZE;

        for (let i = 0; i < this.projects.length; i += this.PAGE_SIZE ) {
            this.pages.push(0);
        }


        this.pageProjects = [];
        for (let i = 0; i < this.PAGE_SIZE && i < this.projects.length; ++i) {
          this.pageProjects.push(this.projects[i]);
        }

        this.loading = false;
      },
      error => {
        console.log("Error:", error);
        this.loading = true;
      }
    );
  }

  onNextClick() {
    if (this.pageIndex + 1 < this.projects.length/this.PAGE_SIZE) {
      this.pageIndex++;
      this.pageProjects = [];
      
      for (let i = this.pageIndex * this.PAGE_SIZE, count = 0; i < this.projects.length && count < this.PAGE_SIZE; ++i, ++count) {
        this.pageProjects.push(this.projects[i]);
      }
    }
  }

  onPreviousClick() {
    if (this.pageIndex - 1 >= 0) {
      this.pageIndex--;
      this.pageProjects = [];
      
      for (let i = this.pageIndex * this.PAGE_SIZE, count = 0; i < this.projects.length && count < this.PAGE_SIZE; ++i, ++count) {
        this.pageProjects.push(this.projects[i]);
      }
    }
  }

  onPageClick(index: number) {
    this.pageIndex = index;
    this.pageProjects = [];
    
    for (let i = this.pageIndex * this.PAGE_SIZE, count = 0; i < this.projects.length && count < this.PAGE_SIZE; ++i, ++count) {
      this.pageProjects.push(this.projects[i]);
    }
  }



}
