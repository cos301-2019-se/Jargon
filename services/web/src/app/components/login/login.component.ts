import { Component, OnInit } from '@angular/core';
import { LoginApiRequesterService } from '../../services/login-api-requester/login-api-requester.service';
import { Router } from '@angular/router';
import { LoginDetails } from '../../interfaces/login-register/login-register';
import { NotifierService } from 'angular-notifier';

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
    this.loginApiRequester.login(this.loginDetails).subscribe((res : any) => {
      console.log(res);

      this.loginDetails = new LoginDetails();
      if (res.authenticated) {
        this.notifierService.notify('success', 'Login Successful')
        this.router.navigateByUrl("/dashboard");
      }
    });
  }

}
