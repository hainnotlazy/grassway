import { changeStatus, getObjectKeys } from 'src/app/core/helpers';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormValidator } from 'src/app/core/validators/form.validator';
import { UsersService } from 'src/app/core/services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ValidationMessage, changePasswordRequirements } from 'src/app/core/forms';
import { ErrorResponse } from 'src/app/core/interfaces';

@UntilDestroy()
@Component({
  selector: 'app-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.scss']
})
export class ChangePasswordFormComponent {
  hidePassword = true;
  hideNewPassword = true;
  hidePasswordConfirmation = true;
  formError = "";
  isProcessing = false;

  // Form requirements
  passwordRequirements = changePasswordRequirements.password.requirements;
  newPasswordRequirements = changePasswordRequirements.newPassword.requirements;

  // Form validation messages
  formValidationMessages: ValidationMessage = {
    passwordNotMatch: "Confirm password is not matched"
  }
  passwordValidationMessages: ValidationMessage = changePasswordRequirements.password.validationMsg;
  newPasswordValidationMessages: ValidationMessage = changePasswordRequirements.newPassword.validationMsg;
  passwordConfirmationValidationMessages: ValidationMessage = changePasswordRequirements.passwordConfirmation.validationMsg;

  changePasswordForm = new FormGroup({
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(this.passwordRequirements.minlength),
      Validators.maxLength(this.passwordRequirements.maxlength)
    ]),
    newPassword: new FormControl("", [
      Validators.required,
      Validators.minLength(this.newPasswordRequirements.minlength),
      Validators.maxLength(this.newPasswordRequirements.maxlength)
    ]),
    confirmPassword: new FormControl("", [
      Validators.required
    ])
  }, [
    FormValidator.changePasswordMatched
  ])

  getObjectKeys = getObjectKeys;

  constructor(
    private usersService: UsersService,
    private snackbar: MatSnackBar
  ) {}

  onSubmit() {
    if (this.changePasswordForm.errors) {
      for (let error of this.getObjectKeys(this.changePasswordForm.errors)) {
        this.formError = this.formValidationMessages[error];
      }
    }

    if (this.changePasswordForm.valid && !this.isProcessing) {
      this.isProcessing = true;
      this.usersService.changePassword(
        this.changePasswordForm.get("password")?.value as string,
        this.changePasswordForm.get("newPassword")?.value as string
      ).pipe(
        tap(() => {
          this.formError = "";
          this.snackbar.open("Password changed successfully", "x", {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
          this.changePasswordForm.markAsPristine();
        }, (error) => {
          this.handleChangePasswordFail(error);
        }),
        finalize(() => {
          this.isProcessing = changeStatus(this.isProcessing);
        }),
        untilDestroyed(this)
      ).subscribe();
    }
  }

  handleChangePasswordFail(error: any) {
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
