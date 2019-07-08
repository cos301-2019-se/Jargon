import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  currentRoute: string;
  home: string;
  view_project: string;
  create_project: string;
  nn: string;
  view_profile: string;
  account_settings: string;

  home_ab: string;
  view_project_ab: string;
  create_project_ab: string;
  nn_ab: string;
  view_profile_ab: string;
  account_settings_ab: string;

  constructor(private router: Router) { }

  ngOnInit() {
    this.currentRoute = this.router.url;
    this.home = this.view_project = this.create_project = this.nn = this.view_profile = this.account_settings = 'inactive';
    this.home_ab = this.view_project_ab = this.create_project_ab = this.nn_ab = this.view_profile_ab = this.account_settings_ab = 'no_ab';

    switch(this.currentRoute){
      case "/" : {
        this.view_project = this.create_project = this.nn = this.view_profile = this.account_settings = 'inactive';
        this.view_project_ab = this.create_project_ab = this.nn_ab = this.view_profile_ab = this.account_settings_ab = 'no_ab';
        this.home = 'active';
        this.home_ab = 'active_bar';
        break;
      }
      case "/home" : {
        this.view_project = this.create_project = this.nn = this.view_profile = this.account_settings = 'inactive';
        this.view_project_ab = this.create_project_ab = this.nn_ab = this.view_profile_ab = this.account_settings_ab = 'no_ab';
        this.home = 'active';
        this.home_ab = 'active_bar';
        break;
      }
      case "/view-projects" : {
        this.home = this.create_project = this.nn = this.view_profile = this.account_settings = 'inactive';
        this.home_ab = this.create_project_ab = this.nn_ab = this.view_profile_ab = this.account_settings_ab = 'no_ab';
        this.view_project_ab = 'active_bar';
        this.view_project  = 'active';
        break;
      }
    }
  }

}
