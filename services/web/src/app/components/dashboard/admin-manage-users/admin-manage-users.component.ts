import { Component, OnInit } from '@angular/core';
import { AdminApiRequesterService } from '../../../services/admin-api-requester/admin-api-requester.service';
import { User } from '../../../interfaces/login-register/login-register';

@Component({
  selector: 'app-admin-manage-users',
  templateUrl: './admin-manage-users.component.html',
  styleUrls: ['./admin-manage-users.component.css']
})
export class AdminManageUsersComponent implements OnInit {

  users: User[][] = [];
  constructor(private adminApiRequester: AdminApiRequesterService) {}

  ngOnInit() {
    this.adminApiRequester.getUsersAdmin().subscribe(
      (users: User[]) => {
        console.log(users);

        if (users !== undefined && users !== null && users.length !== undefined) {
          let list = [];
          let count = 0;
          for (let i = 0; i < users.length; ++i) {
            list.push(users[i]);
            if (++count >= 3) {
              count = 0;
              this.users.push([...list]);
              list = [];
            }
          }
          if (count != 0) {
            this.users.push([...list]);
            list = [];
          }
        }
        console.log(this.users);
      }
    );
  }

}
