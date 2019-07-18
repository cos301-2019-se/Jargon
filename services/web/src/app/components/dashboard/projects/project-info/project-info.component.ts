import { Component, OnInit, ViewChild } from '@angular/core';
import { Project } from '../../../../interfaces/project/project';
import { SharedProjectService } from '../../../../services/shared-project/shared-project.service';
import { Router } from '@angular/router';
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

  constructor(private sharedProjectService: SharedProjectService, 
      private projectApiRequesterService: ProjectApiRequesterService) {

    this.sharedProjectService.project.subscribe(
      (project: Project) => {
        this.project = project;
        this.projectSnapshot = JSON.parse(JSON.stringify(this.project));
        this.projectSnapshot = Object.assign(new Project, this.projectSnapshot);
      }
    );
  }

  ngOnInit() {
  }

  removeWhitelistWord(index: number) {
    if (this.isReadOnly) {
      return;
    }
    this.project.whitelist.splice(index, 1);
  }

  removeBlacklistWord(index: number) {
    if (this.isReadOnly) {
      return;
    }
    this.project.blacklist.splice(index, 1);
  }

  addWhitelistWord() {
    const word = this.whitelistword.trim();

    if (word === '') {
      this.whitelistword = '';
      return;
    }

    this.project.whitelist.push(this.whitelistword);
    this.whitelistword = '';
  }

  addBlacklistWord() {
    const word = this.blacklistword.trim();

    if (word === '') {
      this.blacklistword = '';
      return;
    }
    
    this.project.blacklist.push(this.blacklistword);
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

    if (!this.projectSnapshot.compare(this.project)) {
      this.projectApiRequesterService.updateProject(this.project).subscribe(
        (project: Project) => {
          this.projectSnapshot.blacklist = project.blacklist;
          this.projectSnapshot.whitelist = project.whitelist;
          this.projectSnapshot.project_name = project.project_name;
          this.projectSnapshot.source = project.source;
          this.projectSnapshot.trackTime = project.trackTime;
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
}
