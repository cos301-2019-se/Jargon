import { Component, OnInit } from '@angular/core';
import { RegisterApiRequesterService } from '../../services/register-api-requester/register-api-requester.service';
import { Router } from '@angular/router';
import { RegisterDetails } from '../../interfaces/login-register/login-register';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerDetails: RegisterDetails = new RegisterDetails();

  constructor(private router : Router, 
      private registerApiRequester : RegisterApiRequesterService,
      private notifierService: NotifierService) { }

  ngOnInit() {
    this.registerDetails = new RegisterDetails();
  }

  onRegisterClick() {
    if (this.registerDetails.password !== this.registerDetails.passwordConfirm) {
      //show error
      return;
    }
    this.registerApiRequester.register(this.registerDetails).subscribe((res : any) => {
      console.log(res);

      this.registerDetails = new RegisterDetails();
      if (res.authenticated) {
        this.notifierService.notify('success', 'Registration Successful');
        this.router.navigateByUrl("/dashboard");
      } else {
        this.notifierService.notify('warning', res.result);
      }
    });
  }

}
