import { ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, distinctUntilChanged, filter, finalize, switchMap, take, tap } from 'rxjs';
import { ErrorResponse } from 'src/app/core/interfaces';
import { Brand, User } from 'src/app/core/models';
import { BrandsService, UsersService } from 'src/app/core/services';

@UntilDestroy()
@Component({
  selector: 'app-invite-user-dialog',
  templateUrl: './invite-user-dialog.component.html',
  styleUrls: ['./invite-user-dialog.component.scss']
})
export class InviteUserDialogComponent {
  brand!: Brand;
  isProcessing = false;
  separatorKeysCodes = [ENTER];
  userControl = new FormControl("");

  @ViewChild("userInput") userInput!: ElementRef<HTMLInputElement>;
  filteredUsers: User[] = [];
  selectedUsers: User[] = [];
  membersId: number[] = [];

  constructor(
    private dialogRef: MatDialogRef<InviteUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      membersId: number[]
    },
    private usersService: UsersService,
    private brandsService: BrandsService,
    private snackbar: MatSnackBar
  ) {
    this.membersId = data.membersId;

    this.brandsService.currentBrand$.pipe(
      take(1),
      tap(brand => this.brand = brand),
    ).subscribe();

    this.userControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(value => {
        if (!value) {
          this.filteredUsers = [];
        }
      }),
      filter(value => !!value && value.length >= 3),
      switchMap(value => this.usersService.filterUsers(
        value as string,
        [ ...this.membersId, ...this.selectedUsers.map(user => user.id)]
      )),
      tap(users => {
        this.filteredUsers = users;
      }),
      untilDestroyed(this)
    ).subscribe();
  }

  addUser(event: MatChipInputEvent) {
    const value = (event.value || "").trim();

    if (!value) return;

    const foundUser = this.filteredUsers.find(user => {
      return user.username === value
        || user.email === value
        || user.fullname === value;
    });
    if (foundUser && !this.selectedUsers.find(selectedUser => selectedUser.id === foundUser.id)) {
      this.selectedUsers.push(foundUser);
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
    }
  }

  removeSelectedUser(user: User) {
    this.selectedUsers = this.selectedUsers.filter(selectedUser => selectedUser.id !== user.id);
  }

  onSendInvitation() {
    if (this.isProcessing) {
      return;
    } else if (this.selectedUsers.length === 0) {
      return this.dialogRef.close();
    }

    this.isProcessing = true;
    this.brandsService.sendInvitation(
      this.brand.id,
      this.selectedUsers.map(user => user.id)
    ).pipe(
      tap((members) => {
        this.snackbar.open("Invitation sent successfully", "x", {
          duration: 3000,
          horizontalPosition: "right",
          verticalPosition: "top"
        });
        this.dialogRef.close(members);
      }, err => {
        this.handleProcessFailed(err);
      }),
      finalize(() => this.isProcessing = false),
      untilDestroyed(this)
    ).subscribe();
  }

  private clearUserInput() {
    this.userControl.setValue(null);
    this.userInput.nativeElement.value = "";
  }

  private handleProcessFailed(error: any) {
    const errorResponse: ErrorResponse = error.error;
    let errorMessage = errorResponse.message ?? "Unexpected error happened";

    // Handle if server return more than 1 error
    if (typeof errorMessage === "object") {
      errorMessage = errorMessage[0];
    }

    // Show error message
    this.snackbar.open(errorMessage, "x", {
      duration: 4000,
      horizontalPosition: "right",
      verticalPosition: "top"
    })
  }
}
