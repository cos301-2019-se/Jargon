import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../services/global-service/global-service.service';
import { AdminApiRequesterService } from '../../../services/admin-api-requester/admin-api-requester.service';
import { Project } from '../../../interfaces/project/project';

@Component({
  selector: 'app-admin-manage-projects',
  templateUrl: './admin-manage-projects.component.html',
  styleUrls: ['./admin-manage-projects.component.css']
})
export class AdminManageProjectsComponent implements OnInit {

  projects: Project[] = null;

  constructor(private globalService: GlobalService,
      private adminApiRequester: AdminApiRequesterService) {}

  ngOnInit() {
    this.adminApiRequester.basicAllProjects().subscribe(
      (res: any) => {
        this.projects = res.result;
      }
    );
  }



}
