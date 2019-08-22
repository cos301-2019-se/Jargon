import { Component, OnInit } from '@angular/core';
import {HostListener} from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public innerWidth: any;
  public collapse: boolean;
  public displaySideBarText: boolean;

  directories: any[][] = [
    [
      { caption: "Home", path: "a", icon: "fa-home" },
    ],
    [
      { caption: "Projects", path: "dashboard/projects", icon: "fa-clipboard" },
      { caption: "Create Project", path: "dashboard/create-project", icon: "fa-tasks" },
      { caption: "Compare Project", path: "dashboard/compare-project", icon: "fa-clone" }
    ],
    [
      { caption: "Neural Network", path: "dashboard/neural-network", icon: "fa-network-wired" },
    ],
    [
      { caption: "Account Settings", path: "dashboard/account-settings", icon: "fa-cog"},
      { caption: "View Profile", path: "dashboard/view-profile", icon: "fa-users" },
    ]
  ];

  toggle() {
    // if(window.outerWidth > 960){
      $("#wrapper").toggleClass("toggled");
    // }
  }

  constructor() {
    this.getResize();
  }

  ngOnInit() {


    this.getResize();

    this.displaySideBarText = true;
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

  enter() {
    // this.displaySideBarText = true;
  }

  leave() {
    // this.displaySideBarText = false;
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



