import { Component, OnInit } from '@angular/core';
import { LoginApiRequesterService } from '../../services/login-api-requester/login-api-requester.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginApiRequester : LoginApiRequesterService) { }

  ngOnInit() {
  }

  onUserLogin(form : NgForm)
  {
    const values = form.value;
    const email = values.email;
    const pass = values.password;

    this.loginApiRequester.authenticateUser(email, pass).subscribe((res : any) => {
      console.log(res);
    });
  }

}
