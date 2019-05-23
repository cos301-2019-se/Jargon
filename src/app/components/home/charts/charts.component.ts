import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['../home.component.css']
})
export class ChartsComponent implements OnInit {

  constructor() { }

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public barChartLabels = ['Positive', 'Negative', 'Nuetral'];
  public barChartType = 'doughnut';
  public barChartLegend = true;

  public barChartData = [
    {data: [65, 20, 15]},
  ];

  public chartColors: Array<any> = [
  {
    backgroundColor: ['green', 'red', 'orange']
  }
]

  ngOnInit() {
  }

}
