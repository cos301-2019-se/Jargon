import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['../home.component.css']
})
export class ChartsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var ctx1 = document.getElementById('myChart1');
    var myChart1 = new Chart(ctx1, {
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

    var ctx2 = document.getElementById('myChart2');
    var myChart2 = new Chart(ctx2, {
      type: 'doughnut',
      data: {
          labels: ['Negative', 'Neutral', 'Positive'],
          datasets: [{
              label: 'Analysis',
              data: [50, 30, 20,],
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

    var ctx3 = document.getElementById('myChart3');
    var myChart3 = new Chart(ctx3, {
      type: 'doughnut',
      data: {
          labels: ['Negative', 'Neutral', 'Positive'],
          datasets: [{
              label: 'Analysis',
              data: [5, 65, 30,],
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
