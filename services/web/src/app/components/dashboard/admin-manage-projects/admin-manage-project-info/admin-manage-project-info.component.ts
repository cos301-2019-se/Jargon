import { Component, OnInit } from '@angular/core';
import { Project } from '../../../../interfaces/project/project';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminApiRequesterService } from '../../../../services/admin-api-requester/admin-api-requester.service';
import { SharedAdminProjectService } from '../../../../services/shared-admin-project/shared-admin-project.service';
import { ApiResponse } from '../../../../interfaces/api-response/api-response';

@Component({
  selector: 'app-admin-manage-project-info',
  templateUrl: './admin-manage-project-info.component.html',
  styleUrls: ['./admin-manage-project-info.component.css']
})
export class AdminManageProjectInfoComponent implements OnInit {

  project: Project = new Project();
  projectSnapshot: Project = new Project();

  blacklistword: string = "";
  whitelistword: string = "";

  isReadOnly: boolean = true;

  time: number = 30;

  constructor(private sharedAdminProjectService: SharedAdminProjectService, 
      private adminApiRequester: AdminApiRequesterService,
      private activeRoute: ActivatedRoute,
      private router: Router) {
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => 
      {
        this.isReadOnly = true;
      }
    );
    this.isReadOnly = true;
    this.sharedAdminProjectService.project.subscribe(
      (project: Project) => {
        this.project = project;
        this.projectSnapshot = JSON.parse(JSON.stringify(this.project));
        
        this.projectSnapshot = Object.assign(new Project, this.projectSnapshot);
      }
    );
  }

  removeWhitelistWord(index: number) {
    if (this.isReadOnly) {
      return;
    }
    this.projectSnapshot.whitelist.splice(index, 1);
  }

  removeBlacklistWord(index: number) {
    if (this.isReadOnly) {
      return;
    }
    this.projectSnapshot.blacklist.splice(index, 1);
  }

  addWhitelistWord() {
    const word = this.whitelistword.trim();

    if (word === '') {
      this.whitelistword = '';
      return;
    }

    this.projectSnapshot.whitelist.push(this.whitelistword);
    this.whitelistword = '';
  }

  addBlacklistWord() {
    const word = this.blacklistword.trim();

    if (word === '') {
      this.blacklistword = '';
      return;
    }
    
    this.projectSnapshot.blacklist.push(this.blacklistword);
    this.blacklistword = '';
  }

  compareSource(op1: any, op2: any) {
    return op1 === op2;
  }

  onEditClick() {
    this.isReadOnly = false;
    this.projectSnapshot = JSON.parse(JSON.stringify(this.project));
        
    this.projectSnapshot = Object.assign(new Project, this.projectSnapshot);
  }

  onSaveClick() {
    this.isReadOnly = true;
    console.log("Snap:", this.projectSnapshot);
    console.log("Proj:", this.project);
    if (!this.projectSnapshot.compare(this.project)) {
      this.adminApiRequester.updateProject(this.projectSnapshot).subscribe(
        (resp: any) => {
          this.project.blacklist = this.projectSnapshot.blacklist;
          this.project.whitelist = this.projectSnapshot.whitelist;
          this.project.project_name = this.projectSnapshot.project_name;
          this.project.source = this.projectSnapshot.source;
          this.project.trackTime = this.projectSnapshot.trackTime;
        }
      );
    }
  }

  onCancelClick() {
    this.isReadOnly = true;
    
    if (!this.projectSnapshot.compare(this.project)) {
      //Changes made
    }

    this.projectSnapshot = JSON.parse(JSON.stringify(this.project));
    this.projectSnapshot = Object.assign(new Project, this.projectSnapshot);
  }

  onRemoveProjectClick() {
    this.adminApiRequester.deleteProject(this.project._id).subscribe(
      (response: ApiResponse) => {
        if (response == undefined || response == null || !response.success) {
          return;
        }

        let tempProjects = this.sharedAdminProjectService.getProjects();
        let index = -1;
        for (let i = 0; i < tempProjects.length; ++i) {
          if (tempProjects[i]._id == this.project._id) {
            index = i;
            break;
          }
        }
        if (index >= 0) {
          tempProjects.splice(index, 1);
          this.sharedAdminProjectService.setProjects(tempProjects);
        }
        this.router.navigateByUrl('/dashboard/manage-projects/project-initial');
      }
    );
  }

}
