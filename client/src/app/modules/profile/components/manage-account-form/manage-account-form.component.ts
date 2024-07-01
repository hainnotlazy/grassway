import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { funEmoji } from '@dicebear/collection';
import { createAvatar } from '@dicebear/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, map, tap } from 'rxjs';
import { UserProfileDto } from 'src/app/core/dtos';
import { ValidationMessage, profileRequirements } from 'src/app/core/forms';
import { changeStatus, getObjectKeys } from 'src/app/core/helpers';
import { ErrorResponse } from 'src/app/core/interfaces';
import { UsersService } from 'src/app/core/services';

@UntilDestroy()
@Component({
  selector: 'app-manage-account-form',
  templateUrl: './manage-account-form.component.html',
  styleUrls: ['./manage-account-form.component.scss']
})
export class ManageAccountFormComponent implements OnInit {
  @ViewChild("avatarInput") avatarInput?: ElementRef;

  formError = "";
  avatarUrl = "";
  isProcessing = false;

  // Form Requirements
  fullnameRequirements = profileRequirements.fullname.requirements;
  bioRequirements = profileRequirements.bio.requirements;

  // Form Validation Messages
  fullnameValidationMessages: ValidationMessage = profileRequirements.fullname.validationMsg;
  bioValidationMessages: ValidationMessage = profileRequirements.bio.validationMsg;

  getObjectKeys = getObjectKeys;

  manageAccountForm = new FormGroup({
    fullname: new FormControl("", [
      Validators.required,
      Validators.minLength(this.fullnameRequirements.minlength),
      Validators.maxLength(this.fullnameRequirements.maxlength)
    ]),
    dob: new FormControl(new Date()),
    phone: new FormControl(""),
    gender: new FormControl(""),
    bio: new FormControl("", [
      Validators.maxLength(this.bioRequirements.maxlength)
    ]),
    avatar: new FormControl(null)
  })

  constructor(
    private usersService: UsersService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.usersService.getCurrentUser().pipe(
      map((currentUser) => {
        if (!currentUser.avatar) {
          currentUser.avatar = createAvatar(funEmoji, {
            seed: currentUser.username,
            eyes: ["closed", "closed2", "glasses", "cute", "love", "pissed", "shades", "stars"],
            mouth: ["cute", "lilSmile", "kissHeart", "tongueOut", "wideSmile", "smileTeeth", "smileLol"],
            size: 250,
            backgroundType: ["gradientLinear"],
            backgroundColor: ["b6e3f4","c0aede","d1d4f9"]
          }).toDataUriSync();
        }
        return currentUser;
      }),
      tap((currentUser) => {
        this.manageAccountForm.patchValue({
          fullname: currentUser.fullname,
          dob: currentUser.dob,
          phone: currentUser.phone,
          gender: currentUser.gender,
          bio: currentUser.bio,
        });

        this.avatarUrl = currentUser.avatar;
      }),
      untilDestroyed(this)
    ).subscribe();
  }

  openSelectAvatar() {
    if (this.avatarInput) {
      this.avatarInput.nativeElement.click();
    }
  }

  onAvatarChange(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;

    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      this.manageAccountForm.patchValue({ avatar: file as any });
      this.manageAccountForm.controls.avatar.markAsDirty();
    }
  }

  onSubmit() {
    if (this.manageAccountForm.valid && !this.isProcessing) {
      this.isProcessing = true;
      this.usersService.updateCurrentUser(this.manageAccountForm.value as UserProfileDto).pipe(
        tap(() => {
          this.handleUpdateSuccess();
        }, (error) => {
          this.handleUpdateFail(error);
        }),
        finalize(() => {
          this.isProcessing = changeStatus(this.isProcessing);
        })
      ).subscribe();
    }
  }

  private handleUpdateSuccess() {
    this.formError = "";
    this.snackbar.open("Update account successfully", "x", {
      duration: 3000,
      horizontalPosition: "right",
      verticalPosition: "top"
    })
    this.manageAccountForm.markAsPristine();
  }

  private handleUpdateFail(error: any) {
    const errorResponse: ErrorResponse = error.error;
    let errorMessage = errorResponse.message ?? "Unexpected error happened";

    // Handle if server return more than 1 error
    if (typeof errorMessage === "object") {
      errorMessage = errorMessage[0];
    }

    // Show error message
    this.formError = errorMessage;
    this.snackbar.open(errorMessage, "x", {
      duration: 3000,
      horizontalPosition: "right",
      verticalPosition: "top"
    })
  }
}
