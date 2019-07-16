import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedProjectService } from '../../../../services/shared-project/shared-project.service';
import { Project } from '../../../../interfaces/project/project';
import { Label, MultiDataSet } from 'ng2-charts';
import { ChartType, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-project-result',
  templateUrl: './project-result.component.html',
  styleUrls: ['./project-result.component.css']
})
export class ProjectResultComponent implements OnInit {

  project: Project = null;

  doughnutChartLabels: Label[] = [];//'Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  doughnutChartData: MultiDataSet = [ 
    [350, 450, 100]
  ];
  doughnutChartType: ChartType = 'doughnut';
  doughnutChartOptions: ChartOptions = {
    cutoutPercentage: 80
  };
  
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
