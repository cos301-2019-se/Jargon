import { ProjectApiRequesterService } from './../../services/project-api-requester/project-api-requester.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
  whitelist: string[] = [];
  blacklist: string[] = [];
  whitelistword = '';
  blacklistword = '';

  constructor(private router: Router, private requester: ProjectApiRequesterService) { }

  ngOnInit() {

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

  onCreateProject(form: NgForm) {
    const values = form.value;
    const white = this.whitelist;
    const black = this.blacklist;
    const name = values.name;
    const source = values.source;
    const track = values.track;

    this.requester.createProject(name, source, white, black, track).subscribe((res: any) => {
      console.log(res);
    });
    this.router.navigate(['/']);
  }
}
