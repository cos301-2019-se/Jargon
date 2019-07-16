import { Component, OnInit } from '@angular/core';
import { Project } from '../../../interfaces/project/project';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
  project: Project = new Project();
  projectSnapshot: Project = new Project();

  blacklistword: string = "";
  whitelistword: string = "";


  constructor() { }

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
}
