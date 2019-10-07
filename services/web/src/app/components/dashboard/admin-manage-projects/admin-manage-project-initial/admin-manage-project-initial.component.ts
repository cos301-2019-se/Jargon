import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-manage-project-initial',
  templateUrl: './admin-manage-project-initial.component.html',
  styleUrls: ['./admin-manage-project-initial.component.css']
})
export class AdminManageProjectInitialComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  // onCreateProjectClick() {
  //   this.router.navigateByUrl("../../create-project");
  // }

}
