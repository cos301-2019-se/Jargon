import { Component, OnInit } from '@angular/core';
import { LoginApiRequesterService } from '../../services/login-api-requester/login-api-requester.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginApiRequester : LoginApiRequesterService) { }

  ngOnInit() {
  }

}
