import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RefreshGuardService {

  constructor(private router: Router) {
  }

  public canActivate() {
    if (!this.router.navigated) {
      if (this.router.url.search("project-info/")) {
        this.router.navigateByUrl("/dashboard/projects/project-initial");
      } else if (this.router.url.search("project-result/")) {
        this.router.navigateByUrl("/dashboard/projects/project-initial");
      }
      return false;
    }

    return true;
  }
}
