import { Component, OnInit } from '@angular/core';
import { Project } from '../../../../interfaces/project/project';
import { SharedProjectService } from '../../../../services/shared-project/shared-project.service';
import { Router } from '@angular/router';

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

  constructor(private sharedProjectService: SharedProjectService) {
    this.sharedProjectService.project.subscribe(
      (project: Project) => {
        this.project = JSON.parse(JSON.stringify(project));
        this.projectSnapshot = project;
      }
    );
  }

  ngOnInit() {
  }

  removeWhitelistWord(index: number) {
    this.project.whitelist.splice(index, 1);
  }

  removeBlacklistWord(index: number) {
    this.project.blacklist.splice(index, 1);
  }

  addWhitelistWord() {
    console.log("AAA");2
    const word = this.whitelistword.trim();

    if (word === '') {
      this.whitelistword = '';
      return;
    }

    this.project.whitelist.push(this.whitelistword);
    this.whitelistword = '';
  }

  addBlacklistWord() {
    console.log("AAA");
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

  activateResults() {
    this.sharedProjectService.setHide(true);
  }

}
