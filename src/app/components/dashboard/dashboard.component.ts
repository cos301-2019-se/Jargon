import { Component, OnInit } from '@angular/core';
import {HostListener} from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public innerWidth: any;
  public collapse: boolean;

  directories: any[][] = [
    [
      { caption: "Home", path: "a", icon: "home" },
    ],
    [
      { caption: "View Projects", path: "dashboard/view-projects", icon: "" },
      { caption: "Create Project", path: "dashboard/create-project", icon: "" }
    ],
    [
      { caption: "Neural Network", path: "dashboard/neural-network", icon: "" },
    ],
    [
      { caption: "Account Settings", path: "dashboard/account-settings" },
      { caption: "View Profile", path: "dashboard/view-profile" },
    ]
  ];

  constructor() { }

  ngOnInit() {
    this.getResize();
  }

  ngOnChange() {
    this.getResize();
  }
  
  getResize() {
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



