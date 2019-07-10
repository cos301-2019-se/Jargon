import { ChartsComponent } from './charts/charts.component';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import {HostListener} from '@angular/core';
import { $ } from 'protractor';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public innerWidth: any;
  public collapse: boolean;
 

  constructor() { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    if(this.innerWidth > 1200) {
      this.collapse = false;
    }

    if(this.innerWidth < 1200) {
      this.collapse= true;
    }
  }

  @HostListener('window:resize', ['$event']) onResize(event) { 
    this.innerWidth = window.innerWidth;
    if(this.innerWidth > 1200) {
      this.collapse = false;
    }

    if(this.innerWidth < 1200) {
      this.collapse= true;
    }
  }
}



