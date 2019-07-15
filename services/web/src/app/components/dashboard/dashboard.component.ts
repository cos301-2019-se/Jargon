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
      { caption: "Home", path: "a", icon: "fa-home" },
    ],
    [
      { caption: "Projects", path: "dashboard/projects", icon: "fa-clipboard" },
      { caption: "Create Project", path: "dashboard/create-project", icon: "fa-tasks" }
    ],
    [
      { caption: "Neural Network", path: "dashboard/neural-network", icon: "fa-network-wired" },
    ],
    [
      { caption: "Account Settings", path: "dashboard/account-settings", icon: "fa-cog"},
      { caption: "View Profile", path: "dashboard/view-profile", icon: "fa-users" },
    ]
  ];

  constructor() {
    this.getResize();
  }

  ngOnInit() {
    this.getResize();
  }

  ngOnChange() {
    this.getResize();
  }
  
  getResize() {
    this.innerWidth = window.innerWidth;
    console.log("RESIZE");
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



