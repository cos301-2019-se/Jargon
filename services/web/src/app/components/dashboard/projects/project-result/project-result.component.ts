import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedProjectService } from '../../../../services/shared-project/shared-project.service';
import { Project } from '../../../../interfaces/project/project';
import { Label, MultiDataSet, PluginServiceGlobalRegistrationAndOptions} from 'ng2-charts';
import { ChartType, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-project-result',
  templateUrl: './project-result.component.html',
  styleUrls: ['./project-result.component.css']
})
export class ProjectResultComponent implements OnInit {

  project: Project = null;

  doughnutChartLabels: Label[] = ['positive', 'negative'];//'Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  doughnutChartData: MultiDataSet = [ 
    [80, 20]
  ];
  doughnutChartType: ChartType = 'doughnut';
  doughnutChartOptions: ChartOptions = {
    cutoutPercentage: 80,
    legend: {
      labels: {
        fontColor: 'white'
      }
    }
  };

  public chartColors: any[] = [
  { 
    backgroundColor:["#005C99", "#55BBFF"] 
  }];

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
