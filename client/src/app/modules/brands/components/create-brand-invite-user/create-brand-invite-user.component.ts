import { getObjectKeys } from 'src/app/core/helpers/utils';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { User } from 'src/app/core/models/user.model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { UsersService } from 'src/app/core/services/users.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';

@UntilDestroy()
@Component({
  selector: 'app-create-brand-invite-user',
  templateUrl: './create-brand-invite-user.component.html',
  styleUrls: ['./create-brand-invite-user.component.scss']
})
export class CreateBrandInviteUserComponent implements OnInit {
  separatorKeysCodes = [ENTER];
  userControl = new FormControl("");

  @ViewChild("userInput") userInput!: ElementRef<HTMLInputElement>;
  filteredUsers: User[] = [];
  selectedUsers: User[] = [];

  getObjectKeys = getObjectKeys;

  constructor(
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.userControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(value => {
        if (!value) {
          this.filteredUsers = [];
        }
      }),
      filter(value => !!value),
      switchMap(value => this.usersService.filterUsers(value as string)),
      tap(users => {
        this.filteredUsers = users;
      }),
      untilDestroyed(this)
    ).subscribe();
  }

  addUser(event: MatChipInputEvent) {
    const value = (event.value || "").trim();

    if (!value) return;

    const foundUser = this.filteredUsers.find(user => user.username === value || user.email === value);
    if (foundUser && !this.selectedUsers.find(selectedUser => selectedUser.id === foundUser.id)) {
      this.selectedUsers.push(foundUser);
      this.clearUserInput();
      this.filteredUsers = [];
    }
  }

  selectUser(event: MatAutocompleteSelectedEvent) {
    if (!this.selectedUsers.find(selectedUser => selectedUser.id === event.option.value.id)) {
      this.clearUserInput();
      this.filteredUsers = [];
      this.selectedUsers.push(event.option.value);
    }
  }

  removeSelectedUser(user: User) {
    this.selectedUsers = this.selectedUsers.filter(selectedUser => selectedUser.id !== user.id);
  }

  private clearUserInput() {
    this.userControl.setValue(null);
    this.userInput.nativeElement.value = "";
  }
}
