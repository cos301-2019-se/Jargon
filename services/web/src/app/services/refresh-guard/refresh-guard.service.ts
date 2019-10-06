import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../global-service/global-service.service';

@Injectable({
  providedIn: 'root'
})
export class RefreshGuardService {

  constructor(private router: Router, 
      private globalService: GlobalService) {
  }

  public canActivate() {
    if (!this.router.navigated) {
      if (this.router.url.search("project-info/")) {
        console.log("HELP");
        this.router.navigateByUrl("/dashboard/projects/project-initial");
        // return false;
      } else if (this.router.url.search("project-result/")) {
        //this.router.navigateByUrl("/dashboard/projects/project-initial");
      }
    }

    return true;
  }
}
