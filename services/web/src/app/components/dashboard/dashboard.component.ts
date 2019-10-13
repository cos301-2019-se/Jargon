import { Component, OnInit } from '@angular/core';
import {HostListener} from '@angular/core';
import * as $ from 'jquery';
import { GlobalService } from '../../services/global-service/global-service.service';
import { Router } from '@angular/router';
import { User } from '../../interfaces/login-register/login-register';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public innerWidth: any;
  public collapse: boolean;
  public displaySideBarText: boolean;

  public user: User = null;

  directories: any[][] = [];
    // [
    //   { caption: "Home", path: "a", icon: "fa-home" },
    // ],
    // [
    //   { caption: "Projects", path: "dashboard/projects", icon: "fa-clipboard" },
    //   { caption: "Create Project", path: "dashboard/create-project", icon: "fa-tasks" },
    //   { caption: "Compare Project", path: "dashboard/compare-project", icon: "fa-clone" }
    // ],
    // [
    //   { caption: "Manage Projects", path: "dashboard/manage-projects", icon: "fa-project-diagram"},
    //   { caption: "Manage Users", path: "dashboard/manage-users", icon: "fa-users"},
    //   { caption: "User Statistics", path: "dashboard/user-stats", icon: "fa-chart-area"},
    //   { caption: "Neural Network", path: "dashboard/neural-network", icon: "fa-network-wired" },
    // ],
  //   [
  //     { caption: "Account Settings", path: "dashboard/account-settings", icon: "fa-cog"},
  //     { caption: "View Profile", path: "dashboard/view-profile", icon: "fa-users" },
  //   ]
  // ];

  toggle() {
    // if(window.outerWidth > 960){
    $("#wrapper").toggleClass("toggled");
    // }
  }

  constructor(private globalService: GlobalService,
      private router: Router) {}

  ngOnInit() {
    this.user = this.globalService.getUserValue();
    this.directories.push([
      { caption: "Home", path: "dashboard/home", icon: "fa-home" },
    ]);
    this.directories.push([
      { caption: "Projects", path: "dashboard/projects", icon: "fa-clipboard" },
      { caption: "Create Project", path: "dashboard/create-project", icon: "fa-tasks" },
      { caption: "Compare Project", path: "dashboard/compare-project", icon: "fa-clone" },
      { caption: "Realtime Streaming", path: "dashboard/stream", icon: "fa-stream" }
    ]);
    if (this.globalService.getUserValue().admin) {
      this.directories.push([
        { caption: "Manage Projects", path: "dashboard/manage-projects", icon: "fa-project-diagram"},
        { caption: "Manage Users", path: "dashboard/manage-users", icon: "fa-users"},
        { caption: "User Statistics", path: "dashboard/user-stats", icon: "fa-chart-area"},
        // { caption: "Neural Network", path: "dashboard/neural-network", icon: "fa-network-wired" },
      ]);
    }
    this.directories.push([
      // { caption: "Account Settings", path: "dashboard/account-settings", icon: "fa-cog"},
      { caption: "View Profile", path: "dashboard/view-profile", icon: "fa-users" },
    ]);

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

  onLogoutClick() {
    this.globalService.logout();
    this.router.navigateByUrl('/login');
  }

}



