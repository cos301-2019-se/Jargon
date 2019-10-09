import { Component, OnInit } from '@angular/core';
import { AdminApiRequesterService } from '../../../services/admin-api-requester/admin-api-requester.service';
import { User } from '../../../interfaces/login-register/login-register';
import { NotifierService } from 'angular-notifier';
import { ApiResponse } from '../../../interfaces/api-response/api-response';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css']
})
export class ViewProfileComponent implements OnInit {

  user: User = new User();
  userSnapshot: User = new User();

  isReadOnly: boolean = true;

  private readonly notifier: NotifierService;

  constructor(private adminApiRequester: AdminApiRequesterService, 
      private notifierService: NotifierService) {
    this.notifier = notifierService;
  }

  ngOnInit() {
    this.adminApiRequester.getUser().subscribe(
      (response: ApiResponse) => {
        if (response == undefined || response == null) {
          return;
        }
        let user = response.result;
        this.user.email = user.email;
        this.user.name = user.name;
        this.user.username = user.username;
        this.user.surname = user.surname;

        this.userSnapshot.email = this.user.email;
        this.userSnapshot.name = this.user.name;
        this.userSnapshot.username = this.user.username;
        this.userSnapshot.surname = this.user.surname;
      }
    );
  }

  onEditClick() {
    this.isReadOnly = false;
  }

  onSaveClick() {
    console.log("Snap:", this.userSnapshot);
    console.log("User:", this.user);
    if (this.userSnapshot.compare(this.user)) {
      //no changes made
      console.log("No changes");
      return;
    }

    // if (this.user.password !== this.user.passwordConfirm) {
    //   //password dont match, maybe do in form automatically?
    //   return;
    // }

    this.adminApiRequester.editUser(this.user).subscribe(
      (res: any) => {
        if (res != null) {
          //saved
          this.notifierService.notify('success', 'Saved profile successfully');
          this.userSnapshot.email = this.user.email;
          this.userSnapshot.name = this.user.name;
          this.userSnapshot.surname = this.user.surname;
          this.userSnapshot.password = this.user.password;
          this.userSnapshot.passwordConfirm = this.user.passwordConfirm;

          this.isReadOnly = true;
        } else {
          //failed
          this.notifierService.notify('error', 'Profile could not be saved');
        }
      }
    );
  }

  onCancelClick() {
    this.isReadOnly = true;
    this.user.email = this.userSnapshot.email;
    this.user.name = this.userSnapshot.name;
    this.user.surname = this.userSnapshot.surname;
    this.user.password = this.userSnapshot.password;
    this.user.passwordConfirm = this.userSnapshot.passwordConfirm;
  }

}
