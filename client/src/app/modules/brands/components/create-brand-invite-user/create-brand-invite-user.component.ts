import { getObjectKeys } from 'src/app/core/helpers/utils';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { User } from 'src/app/core/models/user.model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-create-brand-invite-user',
  templateUrl: './create-brand-invite-user.component.html',
  styleUrls: ['./create-brand-invite-user.component.scss']
})
export class CreateBrandInviteUserComponent {
  userControl = new FormControl("");

  users: User[] = [];
  filteredUsers: User[] = [];
  selectedUsers: User[] = [];

  getObjectKeys = getObjectKeys;

  constructor(

  ) {}

  selectUser(event: MatAutocompleteSelectedEvent) {

  }

  removeSelectedUser(user: User) {

  }
}
