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

  userSnapshot: User[] = [];
  users: User[][] = [];
  user: User = new User();
  isLoading: boolean = false;

  constructor(private adminApiRequester: AdminApiRequesterService) {}

  ngOnInit() {
    this.isLoading = true;
    this.adminApiRequester.getUsersAdmin().subscribe(
      (response: ApiResponse) => {
        console.log(response);

        if (response.result !== undefined && response.result !== null && response.result.length !== undefined) {
          this.userSnapshot = response.result;
          this.setUserArray();
        }
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
      }
    );
  }

  onRemoveUserClick() {
    console.log("user:", this.user);
    this.adminApiRequester.deleteUser(this.user.id).subscribe(
      (response: ApiResponse) => {
        if (response == undefined || response == null || !response.success) {
          return;
        }

        // let index = -1;
        // for (let i = 0; i < this.userSnapshot.length; ++i) {
        //   let tempUser = this.userSnapshot[i];
        //   if (this.user.id == tempUser.id) {
        //     index = i;
        //     break;
        //   }
        // }
        // if (index >= 0) {
        //   this.userSnapshot.splice(index, 1);
        // }
        // this.setUserArray();
      }
    );
  }

  onViewUserClick(user: User) {
    this.user = user;
    console.log("Selected:", user);
  }

  onCreateUserClick() {
    
  }

  private setUserArray() {
    let list = [];
    let count = 0;
    for (let i = 0; i < this.userSnapshot.length; ++i) {
      let temp = {
        id: "",
        username: "",
        name: "",
        surname: "",
        email: "",
      };
      if (this.userSnapshot[i].id != undefined && this.userSnapshot[i].id != null) {
        temp.id = this.userSnapshot[i].id;
      }
      if (this.userSnapshot[i].username != undefined && this.userSnapshot[i].username != null) {
        temp.username = this.userSnapshot[i].username;
      }
      if (this.userSnapshot[i].name != undefined && this.userSnapshot[i].name != null) {
        temp.name = this.userSnapshot[i].name;
      }
      if (this.userSnapshot[i].surname != undefined && this.userSnapshot[i].surname != null) {
        temp.surname = this.userSnapshot[i].surname;
      }
      if (this.userSnapshot[i].email != undefined && this.userSnapshot[i].email != null) {
        temp.email = this.userSnapshot[i].email;
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
    console.log(this.users);
  }

}
