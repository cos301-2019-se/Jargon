import { Component, OnInit } from '@angular/core';
import { RegisterApiRequesterService } from '../../services/register-api-requester/register-api-requester.service';
import { Router } from '@angular/router';
import { RegisterDetails } from '../../interfaces/login-register/login-register';
import { NotifierService } from 'angular-notifier';
import { ApiResponse } from '../../interfaces/api-response/api-response';

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
      this.notifierService.notify('warning', 'Provided passwords do not match');
      this.registerDetails.password = "";
      this.registerDetails.passwordConfirm = "";
      return;
    }
    this.registerApiRequester.register(this.registerDetails).subscribe(
      (response: ApiResponse) => {
        console.log(response);

        this.registerDetails = new RegisterDetails();
        this.notifierService.notify(response.success ? 'success' : 'error', response.message);
        if (response.success) {
          this.router.navigateByUrl("/dashboard");
        }
      }
    );
  }

}
