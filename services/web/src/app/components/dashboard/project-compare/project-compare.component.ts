import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Project, ProjectStatistic, AveragePerTime } from '../../../interfaces/project/project';
import { SharedProjectService } from '../../../services/shared-project/shared-project.service';
import { ProjectApiRequesterService } from '../../../services/project-api-requester/project-api-requester.service';
import { HistogramSeriesService, LineSeriesService, PieSeriesService, AccumulationDataLabelService, AccumulationAnnotationService, AccumulationTooltipService, AccumulationLegendService, AccumulationChartModule, DateTimeService } from '@syncfusion/ej2-angular-charts';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-project-compare',
  templateUrl: './project-compare.component.html',
  styleUrls: ['./project-compare.component.css']
})
// <<<<<<< Updated upstream
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
//     title: 'Time (Hours)',
// =======
// export class ProjectCompareComponent {
//   public lineChartData: ChartDataSets[] = [
//     { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
//     { data: [25, 69, 100, 31, 53, 65, 21], label: 'Series B' },
//   ];
//   public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
//   public lineChartOptions: (ChartOptions) = {
//     responsive: true,
//     scales: {
//       xAxes: [{
//         ticks: { fontColor: 'white' },
//         gridLines: { color: 'rgba(255,255,255,0.1)' }
//       }],
//       yAxes: [{
//         ticks: { fontColor: 'white' },
//         gridLines: { color: 'rgba(255,255,255,0.1)' }
//       }]
//     }
// >>>>>>> Stashed changes
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
      private projectApiRequesterService: ProjectApiRequesterService,
      private notifierService: NotifierService) {

    this.projects = this.sharedProjectService.getProjects();

    if (this.projects === null) {
      this.projectApiRequesterService.getProjectsBasic().subscribe(
        (projects: Project[]) => {
          if (projects != null) {
            this.sharedProjectService.setProjects(projects);
            this.projects = this.sharedProjectService.getProjects();
          } else {
            this.notifierService.notify('error', 'Could not load projects');
          }
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
    // console.log(this.projectOneId, this.projectTwoId);
    // console.log("One:", this.projectOneStatistic);
    // console.log("Two:", this.projectTwoStatistic);

    // if (this.projectOneId === null || this.projectTwoId === null) {
    //   return;
    // }

    this.projectApiRequesterService.projectStatistics(this.projectOneId).subscribe(
      (statResult: any) => {
        if (statResult != null && statResult.length != 0) {
          console.log(statResult);
          this.projectOneStatistic = statResult.result[0];
          console.log("One:", this.projectOneStatistic);

  // <<<<<<< Updated upstream
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
  // =======
  //         this.projectOneStatistic.graphs.averageOverTime.forEach(
  //           (avgPerTime: AveragePerTime) => {
  //             // this.lineChartData[0].data.push(
  //             //   avgPerTime.averageSentiment
  //             // );
  // >>>>>>> Stashed changes
            }
          }

          this.min1 = this.projectOneStatistic.min;
          this.max1 = this.projectOneStatistic.max;
          this.mean1 = this.projectOneStatistic.mean;
          this.med1 = this.projectOneStatistic.median;
          this.mode1 = this.projectOneStatistic.mode[0];
          this.sd1 = this.projectOneStatistic.std_dev;
          this.var1 = this.projectOneStatistic.variance;
        } else {
          this.notifierService.notify('error', 'Could not load statistics');
        }
      }
    );

    

    this.projectApiRequesterService.projectStatistics(this.projectTwoId).subscribe(
      (statResult: any) => {
        console.log(statResult);
        if (statResult != null && statResult.length != 0) {
          this.projectTwoStatistic = statResult.result[0];
          console.log("Two:", this.projectTwoStatistic);

  // <<<<<<< Updated upstream
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
  // =======
  //         this.projectTwoStatistic.graphs.averageOverTime.forEach(
  //           (avgPerTime: AveragePerTime) => {
  //             // this.lineChartData[1].data.push(
  //             //   avgPerTime.averageSentiment
  //             // );
  // >>>>>>> Stashed changes
            }
          }

          this.min2 = this.projectTwoStatistic.min;
          this.max2 = this.projectTwoStatistic.max;
          this.mean2 = this.projectTwoStatistic.mean;
          this.med2 = this.projectTwoStatistic.median;
          this.mode2 = this.projectTwoStatistic.mode[0];
          this.sd2 = this.projectTwoStatistic.std_dev;
          this.var2 = this.projectTwoStatistic.variance;
        } else {
          this.notifierService.notify('error', 'Could not load statistics');
        }
      }
    );
  }


}