import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedProjectService } from '../../../../services/shared-project/shared-project.service';
import { Project } from '../../../../interfaces/project/project';
import { Label, MultiDataSet, PluginServiceGlobalRegistrationAndOptions, Color} from 'ng2-charts';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { ProjectApiRequesterService } from '../../../../services/project-api-requester/project-api-requester.service';

@Component({
  selector: 'app-project-result',
  templateUrl: './project-result.component.html',
  styleUrls: ['./project-result.component.css']
})
export class ProjectResultComponent implements OnInit {

  project: Project = new Project();
  currentRun: any = null;

  doughnutChartLabels: Label[] = ['positive', 'negative'];//'Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  doughnutChartData: MultiDataSet = [ 
    // [80, 20],
    [0,0]
  ];
  doughnutChartType: ChartType = 'doughnut';
  doughnutChartOptions: ChartOptions = {
    cutoutPercentage: 80,
    legend: {
      labels: {
        fontColor: 'white'
      }
    },
  };

  doughnutChartPlugins: PluginServiceGlobalRegistrationAndOptions[] = [{
    beforeDraw(chart) {
      const ctx = chart.ctx;
      
      var txt = chart.data.datasets[0].data[0].toString();

      //Get options from the center object in options
      const sidePadding = 60;
      const sidePaddingCalculated = (sidePadding / 100) * (chart.config.options.circumference)

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
      const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);

      //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
      const stringWidth = ctx.measureText(txt).width;
      const elementWidth = (chart.config.options.circumference) - sidePaddingCalculated;

      // Find out how much the font can grow in width.
      const widthRatio = elementWidth / stringWidth;
      const newFontSize = Math.floor(30 * widthRatio);
      const elementHeight = (chart.config.options.circumference);

      // Pick a new font size so it will not be larger than the height of label.
      const fontSizeToUse = Math.min(newFontSize, elementHeight);

      ctx.font = '2.4vw Arial';
      ctx.fillStyle = 'white';

      // Draw text in center

      ctx.fillText(txt+'%', centerX, centerY);
    }
  }];

  chartColors: any[] = [
    { 
      backgroundColor:["#005C99", "#55BBFF"] 
    }
  ];

  lineChartData: ChartDataSets[] = [
    { data: [0.05, 0.15, 0.23, 0.1, 0.35, 0.2, 0.62,0.4, 0.9, 0.45, 1], label:'' },
  ];
  lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November'];

  lineChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      labels: {
        fontColor: '',
        boxWidth: 0
      }
    },
    scales: {
      xAxes: [{
        ticks: {
          fontColor: 'white'
        },
        gridLines: {
          color: ''  // grid line color (can be removed or changed)
        }
      }],
      yAxes: [{
        ticks: {
          fontColor: 'white'
        },
        gridLines: {
          color: ''
        },
      }],
    },
    title: {
      // display: true,
      // text: 'Your chart title',
      // fontColor: 'white',
    },
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'rgba(30, 129, 228, 0.5)',
      backgroundColor: 'rgba(255,0,0,0)',
    },
  ];
  lineChartLegend = true;
  lineChartType = 'line';
  lineChartPlugins = [];

  constructor(private shareProjectService: SharedProjectService,
      private projectApiRequesterService: ProjectApiRequesterService) {

    shareProjectService.project.subscribe(
      (project: Project) => {
        this.projectApiRequesterService.getProjectDetailed(project._id).subscribe(
          (project: Project) => {
            this.project = project;

            this.doughnutChartData = [
              [50, 50]
            ];
          }
        );
      }
    );
  }

  ngOnInit() {
  }

  onChartClicked(event: any) {
    if (event.active == undefined || event.active == null || event.active.length == 0) {
      return;
    }

    let index: number = event.active._index;
    this.currentRun = this.project.runs[index];
  }

}
