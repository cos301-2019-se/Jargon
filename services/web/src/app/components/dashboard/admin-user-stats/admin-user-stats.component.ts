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

  userStatistics: any = null;
  projectsStatistics: any = null;

  constructor(private analyseApiRequesterService: AnalyseApiRequesterService,
      private globalService: GlobalService) { }

  ngOnInit() {
    this.analyseApiRequesterService.getUserStatistics(this.globalService.getUserValue().id).subscribe(
      (response: ApiResponse) => {
        if (response == undefined || response == null || !response.success) {
          return;
        }
        
        console.log(response);
        this.userStatistics = response.result;
      }
    );
    this.analyseApiRequesterService.getProjectStatistics().subscribe(
      (response: ApiResponse) => {
        if (response == undefined || response == null || !response.success) {
          return;
        }
        
        console.log(response);
        this.projectsStatistics = response.result;
      }
    );
  }

}
