import { Component, OnInit } from '@angular/core';
import { LoginApiRequesterService } from '../../services/login-api-requester/login-api-requester.service';
import { Router } from '@angular/router';
import { LoginDetails } from '../../interfaces/login-register/login-register';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  public loginDetails: LoginDetails = new LoginDetails();

  constructor(private router : Router, 
      private loginApiRequester : LoginApiRequesterService) { }

  ngOnInit() {
    this.loginDetails = new LoginDetails();
  }

  onLoginClick() {
    this.loginApiRequester.login(this.loginDetails).subscribe((res : any) => {
      console.log(res);

      this.loginDetails = new LoginDetails();
      if (res.authenticated) {
        this.router.navigateByUrl("/dashboard");
      }
    });
  }

}
