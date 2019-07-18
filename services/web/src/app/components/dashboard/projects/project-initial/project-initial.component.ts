import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-initial',
  templateUrl: './project-initial.component.html',
  styleUrls: ['./project-initial.component.css']
})
export class ProjectInitialComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  // onCreateProjectClick() {
  //   this.router.navigateByUrl("../../create-project");
  // }

}
