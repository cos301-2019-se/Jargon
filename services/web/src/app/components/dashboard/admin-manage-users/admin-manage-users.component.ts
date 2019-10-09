import { Component, OnInit } from '@angular/core';
import { AdminApiRequesterService } from '../../../services/admin-api-requester/admin-api-requester.service';
import { User } from '../../../interfaces/login-register/login-register';
import { ProjectApiRequesterService } from '../../../services/project-api-requester/project-api-requester.service';
import { ApiResponse } from '../../../interfaces/api-response/api-response';

@Component({
  selector: 'app-admin-manage-users',
  templateUrl: './admin-manage-users.component.html',
  styleUrls: ['./admin-manage-users.component.css']
})
export class AdminManageUsersComponent implements OnInit {

  users: User[][] = [];
  user: User = new User();

  constructor(private adminApiRequester: AdminApiRequesterService,
      private projectApiRequester: ProjectApiRequesterService) {}

  ngOnInit() {
    this.adminApiRequester.getUsersAdmin().subscribe(
      (response: ApiResponse) => {
        console.log(response);

        if (response.result !== undefined && response.result !== null && response.result.length !== undefined) {
          let list = [];
          let count = 0;
          let users = response.result;
          for (let i = 0; i < users.length; ++i) {
            let temp = {
              id: "",
              username: "",
              name: "",
              surname: "",
              email: "",
            };
            if (users[i].id != undefined && users[i].id != null) {
              temp.id = users[i].id;
            }
            if (users[i].username != undefined && users[i].username != null) {
              temp.username = users[i].username;
            }
            if (users[i].name != undefined && users[i].name != null) {
              temp.name = users[i].name;
            }
            if (users[i].surname != undefined && users[i].surname != null) {
              temp.surname = users[i].surname;
            }
            if (users[i].email != undefined && users[i].email != null) {
              temp.email = users[i].email;
            }
            list.push(temp);
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

  onRemoveUserClick(id: string) {
    this.adminApiRequester.deleteUser(id).subscribe(
      (response: ApiResponse) => {
        console.log(response);
      }
    );
  }

  onViewUserClick(user: User) {
    this.user = user;
  }

  onCreateUserClick() {
    
  }

}
