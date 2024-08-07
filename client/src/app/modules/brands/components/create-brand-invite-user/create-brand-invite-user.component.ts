import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { UsersService } from 'src/app/core/services/users.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { getObjectKeys } from 'src/app/core/helpers';
import { User } from 'src/app/core/models';

@UntilDestroy()
@Component({
  selector: 'app-create-brand-invite-user',
  templateUrl: './create-brand-invite-user.component.html',
  styleUrls: ['./create-brand-invite-user.component.scss']
})
export class CreateBrandInviteUserComponent implements OnInit {
  @Output() addedUser = new EventEmitter<number>();
  @Output() removedUser = new EventEmitter<number>();

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
      switchMap(value => this.usersService.filterUsers(value as string, this.selectedUsers.map(user => user.id))),
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
      this.addedUser.emit(foundUser.id);
      this.clearUserInput();
      this.filteredUsers = [];
    }
  }

  selectUser(event: MatAutocompleteSelectedEvent) {
    const user = event.option.value;
    if (!this.selectedUsers.find(selectedUser => selectedUser.id === user.id)) {
      this.clearUserInput();
      this.filteredUsers = [];
      this.selectedUsers.push(user);
      this.addedUser.emit(user.id);
    }
  }

  removeSelectedUser(user: User) {
    this.selectedUsers = this.selectedUsers.filter(selectedUser => selectedUser.id !== user.id);
    this.removedUser.emit(user.id);
  }

  private clearUserInput() {
    this.userControl.setValue(null);
    this.userInput.nativeElement.value = "";
  }
}
