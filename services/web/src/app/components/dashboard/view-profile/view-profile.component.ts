import { Component, OnInit } from '@angular/core';
import { AdminApiRequesterService } from '../../../services/admin-api-requester/admin-api-requester.service';
import { User } from '../../../interfaces/login-register/login-register';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {

  user: User = new User();
  userSnapshot: User = new User();

  editable: boolean = false;

  constructor(private adminApiRequester: AdminApiRequesterService) { }

  ngOnInit() {
    this.adminApiRequester.getUser().subscribe(
      (res: User) => {
        if (res == undefined || res == null) {
          return;
        }
        this.user = res;

        this.userSnapshot.email = this.user.email;
        this.userSnapshot.name = this.user.name;
        this.userSnapshot.surname = this.user.surname;
        this.userSnapshot.password = this.user.password;
        this.userSnapshot.passwordConfirm = this.user.passwordConfirm;
      }
    );
  }

  onEditClick() {
    this.editable = true;
  }

  onSaveClick() {
    if (!this.userSnapshot.compare(this.user)) {
      //no changes made
      return;
    }

    if (this.user.password !== this.user.passwordConfirm) {
      //password dont match, maybe do in form automatically?
      return;
    }

    this.adminApiRequester.editUser(this.user).subscribe(
      (res: any) => {
        if (res.status) {
          //saved
          this.userSnapshot.email = this.user.email;
          this.userSnapshot.name = this.user.name;
          this.userSnapshot.surname = this.user.surname;
          this.userSnapshot.password = this.user.password;
          this.userSnapshot.passwordConfirm = this.user.passwordConfirm;

          this.editable = false;
        } else {
          //failed
        }
      }
    );
  }

  onCancelClick() {
    this.editable = false;
    this.user.email = this.userSnapshot.email;
    this.user.name = this.userSnapshot.name;
    this.user.surname = this.userSnapshot.surname;
    this.user.password = this.userSnapshot.password;
    this.user.passwordConfirm = this.userSnapshot.passwordConfirm;
  }

}
