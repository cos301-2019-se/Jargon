import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Project, ProjectStatistic } from '../../../interfaces/project/project';
import { SharedProjectService } from '../../../services/shared-project/shared-project.service';
import { ProjectApiRequesterService } from '../../../services/project-api-requester/project-api-requester.service';

@Component({
  selector: 'app-project-compare',
  templateUrl: './project-compare.component.html',
  styleUrls: ['./project-compare.component.css']
})
export class ProjectCompareComponent {
  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [25, 69, 100, 31, 53, 65, 21], label: 'Series B' },
  ];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions: (ChartOptions) = {
    responsive: true,
    scales: {
      xAxes: [{
        ticks: { fontColor: 'white' },
        gridLines: { color: 'rgba(255,255,255,0.1)' }
      }],
      yAxes: [{
        ticks: { fontColor: 'white' },
        gridLines: { color: 'rgba(255,255,255,0.1)' }
      }]
    }
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(100,100,100,0.5)',
    },
    {
      borderColor: 'black',
      backgroundColor: 'rgba(200,200,200,0.5)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];

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

  ngOnInit() {
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
        this.projectOneStatistic = <ProjectStatistic>(statResult.result[0]);
        console.log("One:", this.projectOneStatistic);
      }
    );

    this.projectApiRequesterService.projectStatistics(this.projectTwoId).subscribe(
      (statResult: any) => {
        console.log(statResult);
        this.projectTwoStatistic = <ProjectStatistic>(statResult.result[0]);
        console.log("Two:", this.projectTwoStatistic);
      }
    );
  }


}