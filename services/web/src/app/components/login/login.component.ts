import { Component, OnInit } from '@angular/core';
import { LoginApiRequesterService } from '../../services/login-api-requester/login-api-requester.service';
import { Router } from '@angular/router';
import { LoginDetails } from '../../interfaces/login-register/login-register';
import { NotifierService } from 'angular-notifier';
import { ApiResponse } from '../../interfaces/api-response/api-response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  public loginDetails: LoginDetails = new LoginDetails();

  constructor(private router : Router, 
      private loginApiRequester : LoginApiRequesterService,
      private notifierService: NotifierService) { }

  ngOnInit() {
    this.loginDetails = new LoginDetails();
  }

  onLoginClick() {
    this.loginApiRequester.login(this.loginDetails).subscribe(
      (response: ApiResponse) => {
        console.log("LoginClick:",response);
        this.loginDetails = new LoginDetails();
        this.notifierService.notify(response.success ? 'success' : 'error', response.message);
        if (response.success) {
          this.router.navigateByUrl("/dashboard");
        }
      }
    );
  }

}
