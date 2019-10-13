import { Injectable } from '@angular/core';
import { GlobalService } from '../global-service/global-service.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private globalService: GlobalService,
      private router: Router) { }

  public canActivate() {
    const token = this.globalService.getTokenValue();
    if (token == undefined || token == null) {
      this.globalService.logout();
      this.router.navigateByUrl("/login");
      return false;
    }

    return true;
  }
}
