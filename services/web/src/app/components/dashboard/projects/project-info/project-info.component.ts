import { Component, OnInit, ViewChild } from '@angular/core';
import { Project } from '../../../../interfaces/project/project';
import { SharedProjectService } from '../../../../services/shared-project/shared-project.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Form, NgForm } from '@angular/forms';
import { ProjectApiRequesterService } from '../../../../services/project-api-requester/project-api-requester.service';

@Component({
  selector: 'app-project-info',
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.css']
})
export class ProjectInfoComponent implements OnInit {

  project: Project = new Project();
  projectSnapshot: Project = new Project();

  blacklistword: string = "";
  whitelistword: string = "";

  isReadOnly: boolean = true;

  time: number = 30;

  constructor(private sharedProjectService: SharedProjectService, 
      private projectApiRequesterService: ProjectApiRequesterService,
      private activeRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => 
      {
        this.isReadOnly = true;
      }
    );
    this.isReadOnly = true;
    this.sharedProjectService.project.subscribe(
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
  }

  onSaveClick() {
    this.isReadOnly = true;
    console.log("Snap:", this.projectSnapshot);
    console.log("Proj:", this.project);
    if (!this.projectSnapshot.compare(this.project)) {
      this.projectApiRequesterService.updateProject(this.projectSnapshot).subscribe(
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
  }

  onStartClick() {
    if (this.project == null)
      return;

    this.projectApiRequesterService.startProject(this.project).subscribe(
      resp => {
        console.log("Complete:", resp);
      }
    );
  }
}
