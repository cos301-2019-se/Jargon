import { Projects } from './../../shared/project/projects';
import { ProjectApiRequesterService } from './../../services/project-api-requester/project-api-requester.service';
import { Component, OnInit } from '@angular/core';
import * as cloneDeep from 'lodash/cloneDeep';
import { NgForm } from '@angular/forms';
import { resetCompiledComponents } from '@angular/core/src/render3/jit/module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-projects',
  templateUrl: './view-projects.component.html',
  styleUrls: ['./view-projects.component.css']
})

export class ViewProjectsComponent implements OnInit {
  public projectData = [];
  public projectDataBackup = [];
  whitelist: string[] = [];
  blacklist: string[] = [];
  whitelistword = '';
  blacklistword = '';

  editMode: boolean;

  constructor(private router: Router, private requester: ProjectApiRequesterService) { }

  ngOnInit() {
    this.requester.getProjects().subscribe((res: Projects[]) => {
      this.projectData = JSON.parse(JSON.stringify(res));
      this.projectDataBackup = JSON.parse(JSON.stringify(res));
    });

    this.editMode = false;
  }

  addWhitelistWord() {
    const word = this.whitelistword.trim();

    if (word === '') {
      this.whitelistword = '';
      return;
    }

    this.whitelist.push(this.whitelistword);
    this.whitelistword = '';
  }

  addBlacklistWord() {
    const word = this.blacklistword.trim();

    if (word === '') {
      this.blacklistword = '';
      return;
    }

    this.blacklist.push(this.blacklistword);
    this.blacklistword = '';
  }

  removeWhitelistWord(index: number) {
    this.whitelist.splice(index, 1);
  }

  removeBlacklistWord(index: number) {
    this.blacklist.splice(index, 1);
  }

  changeMode(form: NgForm, id: number) {
    if (this.editMode) {
      this.update(form, id);
      this.editMode = false;
    } else {
      this.editMode = true;
    }
  }

  assignArrays(index: number) {
    this.whitelist = this.projectData[index].whitelist;
    this.blacklist = this.projectData[index].blacklist;
  }

  reset(form: NgForm) {
    this.editMode = false;
    form.reset();

    this.projectData = JSON.parse(JSON.stringify(this.projectDataBackup));
  }

  resetData(form: NgForm) {

    if (this.editMode === true) {
      this.projectData = JSON.parse(JSON.stringify(this.projectDataBackup));
    }

    this.editMode = false;
  }

  update(form: NgForm, id: number) {
    let pos = 0;
    for (let i = 0; i < this.projectData.length; i++) {
      if (this.projectData[i]._id === id) {
        pos = i;
      }
    }

    const values = form.value;

    this.projectDataBackup[pos].project_name = values.name;
    this.projectDataBackup[pos].source = values.source;
    this.projectDataBackup[pos].trackTime = values.track;
    this.projectDataBackup[pos].whitelist = this.whitelist;
    this.projectDataBackup[pos].blacklist = this.blacklist;

    this.reset(form);
    this.requester.updateProject(id, values.name, values.source, values.track, this.whitelist, this.blacklist).subscribe((res: any) => {
    });
  }

  remove(form: NgForm, id: number) {
    this.requester.deleteProject(id).subscribe((res: any) => {
    });
    this.router.navigate(['/']);
  }

  start(id: number) {
    console.log(id);
    // this.requester.start(id).subscribe((res: any) => {
    //   console.log(res);
    // });
  }
}
