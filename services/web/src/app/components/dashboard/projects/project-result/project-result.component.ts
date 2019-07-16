import { Component, OnInit } from '@angular/core';
import { SharedProjectService } from '../../../../services/shared-project/shared-project.service';
import { Project } from '../../../../interfaces/project/project';

@Component({
  selector: 'app-project-result',
  templateUrl: './project-result.component.html',
  styleUrls: ['./project-result.component.css']
})
export class ProjectResultComponent implements OnInit {

  project: Project = null;
  constructor(private shareProjectService: SharedProjectService) {
    shareProjectService.project.subscribe(
      (project: Project) => {
        this.project = project;
      }
    );
  }

  ngOnInit() {
  }

  deactivateResults() {
    this.shareProjectService.setHide(false);
  }

}
