import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedProjectService } from '../../../../services/shared-project/shared-project.service';
import { Project, Run, SocialData, ProjectStatistic, AveragePerTime } from '../../../../interfaces/project/project';
import { Label, MultiDataSet, PluginServiceGlobalRegistrationAndOptions, Color} from 'ng2-charts';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { ProjectApiRequesterService } from '../../../../services/project-api-requester/project-api-requester.service';
import { FlagData } from '../../../../interfaces/flagger/flag-data';
import { FlaggerApiRequesterService } from '../../../../services/flagger-api-requester/flagger-api-requester.service';
import { ILoadedEventArgs, IAccTextRenderEventArgs } from '@syncfusion/ej2-charts';

@Component({
  selector: 'app-project-result',
  templateUrl: './project-result.component.html',
  styleUrls: ['./project-result.component.css']
})
export class ProjectResultComponent implements OnInit {

  /* Doughnut Chart */
  public piedata: Object[] = [
    { x: '80', y: 80, text: '80%'},
    { x: '20', y: 20, text: '20%'},
  ];
  public legendSettings: Object = {
    visible: true,
    textStyle: {
      size: '25px',
      color: 'white'
    }
  };
  public datalabel: Object = {
    visible: true,
    name: 'text',
    position: 'Inside',
    size: '125px'
  };

  /* Sentiment Distribution - Histogram with Normal-ish Distribution*/
  public chartArea: Object = {
    background: 'skyblue',
    canResize: true,
  };
  public dataHistogram: Object[] = [];
  public primaryXAxisHistogram: Object = {
    minimum: 0, maximum: 100, interval: 10,
    title: 'Sentiment (%)',
    titleStyle: {
      color: 'white',
      size: '18px'
    },
    labelStyle: {
      color: 'white',
      size: '16px',
    },
    series: [{
      stroke: 'white'
    }]
  };
  public primaryYAxisHistogram: Object = {
    minimum: 0, interval: 2,
    title: 'Frequency',
    titleStyle: {
      color: 'white',
      size: '18px'
    },
    labelStyle: {
      color: 'white',
      size: '16px',
    }
  };
  public loadHistogram(args: ILoadedEventArgs): void {
    // let points: number[] = [
    //   0,0,0,
    //   10,10,10,10,
    //   20,20,20,20,20,20,
    //   30,30,30,
    //   40,40,
    //   90
    // ];
    // points.map((value: number) => {
    //   this.dataHistogram.push({
    //     y: value
    //   });
    // });
  };
  public binInterval: number = 10;
  public columnWidth: number = 0.99;
  public showNormalDistribution: boolean = false;
  
  /* Average Sentiment Over Time */
  public chartDataAvgSentiment: Object[] = [
    // { x: 3, y: 27 },
    // { x: 5, y: 35 },
    // { x: 9, y: 25 },
    // { x: 10, y: 32 },
    // { x: 11, y: 26 },
    // { x: 28, y: 30 }
  ];

  public markerAvgSentiment: Object = {
    visible: true,
    fill: 'rgb(39,141,199)',
    height: 10,
    width: 10
  }
  
  public primaryXAxisAvgSentiment: Object = {
    // valueType: 'DateTime',
    // interval: 365,
    interval: 1,
    minimum: 0,
    maximum: 23,
    title: 'Time (hours of day)',
    titleStyle: {
      color: 'white',
      size: '18px'
    },
    labelStyle: {
      color: 'white',
      size: '16px',
    }

  };
  public primaryYAxisAvgSentiment: Object = {
    minimum: 0,
    title: 'Average Sentiment',
    titleStyle: {
      color: 'white',
      size: '18px'
    },
    labelStyle: {
      color: 'white',
      size: '16px'
    }
  };

   /* Rate of Change in Sentiment */
   public chartDataROC: Object[] = [
    // { x: 3, y: 27 },
    // { x: 5, y: 35 },
    // { x: 9, y: 25 },
    // { x: 10, y: 32 },
    // { x: 11, y: 26 },
    // { x: 28, y: 30 }
  ];

  public markerROC: Object = {
    visible: true,
    fill: 'rgb(39,141,199)',
    height: 10,
    width: 10
  }
  
  public primaryXAxisROC: Object = {
    // valueType: 'DateTime',
    // interval: 365,
    interval: 1,
    minimum: 0,
    maximum: 23,
    title: 'Time (hours of day)',
    titleStyle: {
      color: 'white',
      size: '18px'
    },
    labelStyle: {
      color: 'white',
      size: '16px',
    }

  };
  public primaryYAxisROC: Object = {
    title: 'Average Change in Sentiment ',
    titleStyle: {
      color: 'white',
      size: '18px'
    },
    labelStyle: {
      color: 'white',
      size: '16px'
    }
  }; 
  


  project: Project = new Project();
  currentRun: Run = new Run();
  filteredData: SocialData[] = [];
  projectAnalysis: ProjectStatistic = new ProjectStatistic();

  activeFlagging: boolean = false;

  filter: string = "All";
  sorting: string = "Oldest"

  // doughnutChartLabels: Label[] = ['positive', 'negative'];//'Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  // doughnutChartData: MultiDataSet = [ 
  //   // [80, 20],
  //   [0,0]
  // ];
  // doughnutChartType: ChartType = 'doughnut';
  // doughnutChartOptions: ChartOptions = {
  //   cutoutPercentage: 80,
  //   legend: {
  //     labels: {
  //       fontColor: 'white'
  //     }
  //   },
  // };

  // doughnutChartPlugins: PluginServiceGlobalRegistrationAndOptions[] = [{
  //   beforeDraw(chart) {
  //     const ctx = chart.ctx;
      
  //     var txt = chart.data.datasets[0].data[0].toString();

  //     //Get options from the center object in options
  //     const sidePadding = 60;
  //     const sidePaddingCalculated = (sidePadding / 100) * (chart.config.options.circumference)

  //     ctx.textAlign = 'center';
  //     ctx.textBaseline = 'middle';
  //     const centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
  //     const centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);

  //     //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
  //     const stringWidth = ctx.measureText(txt).width;
  //     const elementWidth = (chart.config.options.circumference) - sidePaddingCalculated;

  //     // Find out how much the font can grow in width.
  //     const widthRatio = elementWidth / stringWidth;
  //     const newFontSize = Math.floor(30 * widthRatio);
  //     const elementHeight = (chart.config.options.circumference);

  //     // Pick a new font size so it will not be larger than the height of label.
  //     const fontSizeToUse = Math.min(newFontSize, elementHeight);

  //     ctx.font = '2.4vw Arial';
  //     ctx.fillStyle = 'white';

  //     // Draw text in center

  //     ctx.fillText(txt+'%', centerX, centerY);
  //   }
  // }];

  // chartColors: any[] = [
  //   { 
  //     backgroundColor:["#005C99", "#55BBFF"] 
  //   }
  // ];

  // lineChartData: ChartDataSets[] = [
  //   { data: [], label:'' },
  // ];
  // lineChartLabels: Label[] = [];//'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November'];

  // lineChartOptions: ChartOptions = {
  //   responsive: true,
  //   legend: {
  //     labels: {
  //       fontColor: '',<ProjectStatistic>
  //       boxWidth: 0
  //     }
  //   },
  //   scales: {
  //     xAxes: [{
  //       ticks: {
  //         fontColor: 'white'
  //       },
  //       gridLines: {
  //         color: ''  // grid line color (can be removed or changed)
  //       }
  //     }],
  //     yAxes: [{
  //       ticks: {
  //         fontColor: 'white'
  //       },
  //       gridLines: {
  //         color: ''
  //       },
  //     }],
  //   },
  //   title: {
  //     // display: true,
  //     // text: 'Your chart title',
  //     // fontColor: 'white',
  //   },
  // };

  // lineChartColors: Color[] = [
  //   {
  //     borderColor: 'rgba(30, 129, 228, 0.5)',
  //     backgroundColor: 'rgba(255,0,0,0)',
  //   },
  // ];
  // lineChartLegend = true;
  // lineChartType = 'line';
  // lineChartPlugins = [];

  constructor(private shareProjectService: SharedProjectService,
      private projectApiRequesterService: ProjectApiRequesterService,
      private flaggerApiRequesterService: FlaggerApiRequesterService) {

    shareProjectService.project.subscribe(
      (project: Project) => {
        this.projectApiRequesterService.getProjectDetailed(project._id).subscribe(
          (project: any) => {
            this.project = project;

            // let index = this.project.runs.length - 1;
            // this.selectCurrentRun(index);

            // let data: number[] = [];
            // let label: string[] = [];

            console.log(this.project);
            console.log(this.piedata);
            // this.project.runs.forEach(
            //   (run: Run) => {
            //     data.push(run.averageScore);
            //     label.push(run.dateRun.toString());
            //   }
            // );

            // this.lineChartData = [
            //   { data: [...data], label:'' },
            // ];
            // this.lineChartLabels = [...label];

            // this.chartData = [];
            
            this.onSortItemClick(this.sorting);
            this.onFilterItemClick(this.filter);
          }
        );

        this.projectApiRequesterService.projectStatistics(project._id).subscribe(
          (result: any) => {
            console.log("Response:", result);
            this.projectAnalysis = result.result[0];
            
            
            this.projectAnalysis.graphs.histogram.map(
              (value: number) => {
                this.dataHistogram.push({
                  y: value
                });
              }
            );

            this.dataHistogram = [...this.dataHistogram];

            for (let i = 0; i < this.projectAnalysis.graphs.averageOverTime.length; ++i) {
              if (this.projectAnalysis.graphs.averageOverTime[i].averageSentiment >= 0.0) {
                this.chartDataAvgSentiment.push(
                  { 
                    x: i, 
                    y: this.projectAnalysis.graphs.averageOverTime[i].averageSentiment < 0.0 ? 
                      0.0 :
                      this.projectAnalysis.graphs.averageOverTime[i].averageSentiment
                  }
                );
              }
              // this.chartDataAvgSentiment.push(
              //   { 
              //     x: i, 
              //     y: this.projectAnalysis.graphs.averageOverTime[i].averageSentiment < 0.0 ? 
              //       0.0 :
              //       this.projectAnalysis.graphs.averageOverTime[i].averageSentiment
              //   }
              // );
            }
            this.chartDataAvgSentiment = [...this.chartDataAvgSentiment];

            for (let i = 0; i < this.projectAnalysis.graphs.changeOverTime.length; ++i) {
              this.chartDataROC.push(
                { 
                  x: i, 
                  y: this.projectAnalysis.graphs.changeOverTime[i]
                }
              );
            }
            this.chartDataROC = [...this.chartDataROC];
          }
        );
      }
    );
  }

  ngOnInit() {
    // var list = {"you": 100, "me": 75, "foo": 116, "bar": 15};
    // let keysSorted = Object.keys(list).sort(function(a,b){return list[a]-list[b]})
    // console.log(keysSorted);     // bar,me,you,foo
  }

  onChartClicked(event: any) {
    if (event.active == undefined || event.active == null || event.active.length == 0) {
      return;
    }

    let index: number = event.active[0]._index;
    // console.log("waddap:", event);
    this.selectCurrentRun(index);
  }

  selectCurrentRun(index: number) {
    if (index == -1) {
      return;
    }

    this.currentRun = this.project.runs[index];
    const decimals = 4;
    this.currentRun.bestTweetSentiment = parseFloat(this.currentRun.bestTweetSentiment.toFixed(decimals));
    this.currentRun.worstTweetSentiment = parseFloat(this.currentRun.worstTweetSentiment.toFixed(decimals));
    console.log('Current Run:',this.currentRun);
    let avg = Math.round(this.currentRun.averageScore*100);
    // this.doughnutChartData = [
    //   [
    //     avg,
    //     100-avg
    //   ]
    // ];
    this.piedata = [
      { x: 'Positive', y: avg, text: (avg).toString()+'%'},
      { x: 'Negative', y: 100-avg, text: (100-avg).toString()+'%'},
    ];
  }

  compareItemString(op1: any, op2: any) {
    return op1 === op2;
  }

  onSortItemClick(value: string) {
    console.log("AAAA");
    if (value === "Oldest") {
      this.filteredData.sort(
        (itm1, itm2) => {
          if (new Date(itm1.tweetObject.created_at) < new Date(itm2.tweetObject.created_at))
            return -1;
          if (new Date(itm1.tweetObject.created_at) >= new Date(itm2.tweetObject.created_at))
            return 1;
          return 0;
        }
      );
      this.filteredData = [...this.filteredData]
    } else if (value === "Newest") {
      this.filteredData.sort(
        (itm1, itm2) => {
          if (new Date(itm1.tweetObject.created_at) >= new Date(itm2.tweetObject.created_at)) 
            return -1;
          if (new Date(itm1.tweetObject.created_at) < new Date(itm2.tweetObject.created_at))
            return 1;
          return 0;
        }
      );
    }
  }

  onFilterItemClick(value: string) {
    console.log("BBBB");
    if (value === "All") {
      console.log("ALL");
      this.filteredData = [...this.project.data];
    } else if (value === "Positive") {
      console.log("POS");
      this.filteredData = [];
      for (let i = 0; i < this.project.data.length; ++i) {
        let sentiment = this.project.data[i].tweetSentiment;
        if (sentiment >= 0.5) {
          this.filteredData.push(this.project.data[i]);
        }
      }
    } else if (value === "Negative") {
      console.log("NEG");
      this.filteredData = [];
      for (let i = 0; i < this.project.data.length; ++i) {
        let sentiment = this.project.data[i].tweetSentiment;
        if (sentiment < 0.5) {
          this.filteredData.push(this.project.data[i]);
        }
      }
    }
  }

  onFlagTweetsClick() {
    if (this.activeFlagging) {
      let data = [];
      this.filteredData.forEach(
        fdata => {
          if (fdata['checked'] != undefined && fdata['checked']) {
            data.push(fdata);
          }
        }
      )
      console.log("Stuff:", data);
    }
    this.activeFlagging = true;
  }

  onCancelClick() {
    this.activeFlagging = false;

    this.filteredData.forEach(
      (data: SocialData) => {
        data['checked'] = false;
      }
    );
  }

  onSaveFlaggedItems() {
    let flaggedData: FlagData[] = [];
    
    for (let i = 0; i < this.filteredData.length; ++i) {
      let flagData: FlagData = new FlagData();

      if (this.filteredData[i]['checked']) {
        flagData.text = this.filteredData[i].tweetObject.text;
        flagData.currentScore = this.filteredData[i].tweetSentiment;
        flagData.alternateScore = this.filteredData[i]['new_sentiment'];

        flaggedData.push(flagData);
      }
    }

    if (flaggedData.length == 0) {
      return;
    }
    console.log(flaggedData);

    this.flaggerApiRequesterService.flagData(flaggedData).subscribe(
      list => {
        this.activeFlagging = false;
      },
      error => {
        console.log("Error");
        this.activeFlagging = false;
      }
    );
  }

  onCheckboxClick(index: number) {
    this.filteredData[index]['new_sentiment'] = 0.5;
  }

}
