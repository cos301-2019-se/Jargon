import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Project, ProjectStatistic, AveragePerTime } from '../../../interfaces/project/project';
import { SharedProjectService } from '../../../services/shared-project/shared-project.service';
import { ProjectApiRequesterService } from '../../../services/project-api-requester/project-api-requester.service';
import { HistogramSeriesService, LineSeriesService, PieSeriesService, AccumulationDataLabelService, AccumulationAnnotationService, AccumulationTooltipService, AccumulationLegendService, AccumulationChartModule, DateTimeService } from '@syncfusion/ej2-angular-charts';

@Component({
  selector: 'app-project-compare',
  templateUrl: './project-compare.component.html',
  styleUrls: ['./project-compare.component.css']
})
export class ProjectCompareComponent implements OnInit{

  ngOnInit(): void {
  }
  
  public min1 = 0;
  public min2 = 0;

  public max1 = 0;
  public max2 = 0;

  public mean1 = 0;
  public mean2 = 0;

  public med1 = 0;
  public med2 = 0;

  public mode1 = 0;
  public mode2 = 0;

  public sd1 = 0
  public sd2 = 0;

  public var1 = 0;
  public var2 = 0;

  public chartData = [];

  public point : Object = {

  };

  public chartData2 = [];

  public primaryXAxis : Object = {
    interval: 1,
    title: 'Time (Hours)',
  };

  public primaryYAxis : Object = {
    title: 'Sentiment Value',
  }

  public title : String = 'Average Sentiment Over Time';

  projects: Project[] = null;
  projectOneId: string = null;
  projectTwoId: string = null;

  projectOneStatistic: ProjectStatistic = null;
  projectTwoStatistic: ProjectStatistic = null;

  constructor(private sharedProjectService: SharedProjectService,
      private projectApiRequesterService: ProjectApiRequesterService) {

    this.projects = this.sharedProjectService.getProjects();

    if (this.projects === null) {
      this.projectApiRequesterService.getProjectsBasic().subscribe(
        (projects: Project[]) => {
          this.sharedProjectService.setProjects(projects);
          this.projects = this.sharedProjectService.getProjects();
        },
        error => {
          console.log("Error", error);
        }
      );
    }
  }

  compareItemString(op1: any, op2: any) {
    return op1 === op2;
  }

  onCompareClick() {
    console.log(this.projectOneId, this.projectTwoId);
    console.log("One:", this.projectOneStatistic);
    console.log("Two:", this.projectTwoStatistic);

    if (this.projectOneId === null || this.projectTwoId === null) {
      return;
    }

    this.projectApiRequesterService.projectStatistics(this.projectOneId).subscribe(
      (statResult: any) => {
        console.log(statResult);
        this.projectOneStatistic = statResult.result[0];
        console.log("One:", this.projectOneStatistic);

        this.chartData = [];

        for (let i = 0; i < this.projectOneStatistic.graphs.averageOverTime.length; ++i) {
          if (this.projectOneStatistic.graphs.averageOverTime[i].averageSentiment >= 0.0) {
            this.chartData.push(
              { 
                x: i, 
                y: this.projectOneStatistic.graphs.averageOverTime[i].averageSentiment < 0.0 ? 
                  0.0 :
                  this.projectOneStatistic.graphs.averageOverTime[i].averageSentiment
              }
            );
          }
        }

        this.min1 = this.projectOneStatistic.min;
        this.max1 = this.projectOneStatistic.max;
        this.mean1 = this.projectOneStatistic.mean;
        this.med1 = this.projectOneStatistic.median;
        this.mode1 = this.projectOneStatistic.mode[0];
        this.sd1 = this.projectOneStatistic.std_dev;
        this.var1 = this.projectOneStatistic.variance;
      }
    );

    

    this.projectApiRequesterService.projectStatistics(this.projectTwoId).subscribe(
      (statResult: any) => {
        console.log(statResult);
        this.projectTwoStatistic = statResult.result[0];
        console.log("Two:", this.projectTwoStatistic);

        this.chartData2 = [];

        for (let i = 0; i < this.projectTwoStatistic.graphs.averageOverTime.length; ++i) {
          if (this.projectTwoStatistic.graphs.averageOverTime[i].averageSentiment >= 0.0) {
            this.chartData2.push(
              { 
                x: i, 
                y: this.projectTwoStatistic.graphs.averageOverTime[i].averageSentiment < 0.0 ? 
                  0.0 :
                  this.projectTwoStatistic.graphs.averageOverTime[i].averageSentiment
              }
            );
          }
        }

        this.min2 = this.projectTwoStatistic.min;
        this.max2 = this.projectTwoStatistic.max;
        this.mean2 = this.projectTwoStatistic.mean;
        this.med2 = this.projectTwoStatistic.median;
        this.mode2 = this.projectTwoStatistic.mode[0];
        this.sd2 = this.projectTwoStatistic.std_dev;
        this.var2 = this.projectTwoStatistic.variance;
      }
    );
  }


}