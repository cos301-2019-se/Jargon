import { Component, OnInit } from '@angular/core';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['../home.component.css']
})
export class ChartsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // var ctx1 = document.getElementById('myChart1');
    var myChart1 = new Chart('myChart1', {
      type: 'doughnut',
      data: {
          labels: ['Negative', 'Neutral', 'Positive'],
          datasets: [{
              label: 'Analysis',
              data: [20, 10, 90,],
              backgroundColor: [
                'red', 'yellow', 'green'
              ],
              borderColor: [
                'red', 'yellow', 'green'
              ],
              borderWidth: 0
          }]
      },
      options: {
        cutoutPercentage: 70
      }
    });
  }

}
