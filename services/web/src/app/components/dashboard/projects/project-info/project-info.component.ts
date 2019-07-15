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

  constructor(private sharedProjectService: SharedProjectService, private router: Router) {
      this.sharedProjectService.project.subscribe(
          (project: Project) => {
              this.project = project
          }
      );
  }

  ngOnInit() {
      // console.log("YOH-OnInit");
      // this.project = this.sharedProjectService.getCurrentProject();
  }

}
