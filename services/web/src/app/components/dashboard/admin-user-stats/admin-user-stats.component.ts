import { Component, OnInit } from '@angular/core';
import { AnalyseApiRequesterService } from '../../../services/analyse-api-requester/analyse-api-requester.service';
import { GlobalService } from '../../../services/global-service/global-service.service';
import { ApiResponse } from '../../../interfaces/api-response/api-response';

@Component({
  selector: 'app-admin-user-stats',
  templateUrl: './admin-user-stats.component.html',
  styleUrls: ['./admin-user-stats.component.css']
})
export class AdminUserStatsComponent implements OnInit {

  userStatistics: any = {
    totalUsers: 0,
    averageProjectsPerUser: 0
  };
  projectsStatistics: any = {
    totalAverageSentiment: 0,
    totalProjects: 0,
    totalTimesAnalysed: 0
  };
  isLoadingUserStats: boolean = false;
  isLoadingProjectStats: boolean = false;

  constructor(private analyseApiRequesterService: AnalyseApiRequesterService,
      private globalService: GlobalService) { }

  ngOnInit() {
    this.isLoadingUserStats = true;
    this.isLoadingProjectStats = true;

    this.analyseApiRequesterService.getUserStatistics(this.globalService.getUserValue().id).subscribe(
      (response: ApiResponse) => {
        if (response == undefined || response == null || !response.success) {
          this.isLoadingUserStats = false;
          return;
        }
        
        console.log(response);
        this.userStatistics.totalUsers = response.result.totalUsers;
        this.userStatistics.averageProjectsPerUser = response.result.averageProjectsPerUser;
        this.isLoadingUserStats = false;
      },
      error => {
        this.isLoadingUserStats = false;
      }
    );
    this.analyseApiRequesterService.getProjectStatistics().subscribe(
      (response: ApiResponse) => {
        if (response == undefined || response == null || !response.success) {
          this.isLoadingProjectStats = false;
          return;
        }
        
        console.log(response);
        this.projectsStatistics.totalAverageSentiment = response.result.totalAverageSentiment;
        this.projectsStatistics.totalProjects = response.result.totalProjects;
        this.projectsStatistics.totalTimesAnalysed = response.result.totalTimesAnalysed;
        this.isLoadingProjectStats = false;
      },
      error => {
        this.isLoadingProjectStats = false;
      }
    );
  }

}
