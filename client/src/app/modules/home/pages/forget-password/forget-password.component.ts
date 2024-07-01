import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatest, finalize, map, tap, timer } from 'rxjs';
import { UsersService } from 'src/app/core/services';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorResponse } from 'src/app/core/interfaces/error-response.interface';
import { User } from 'src/app/core/models';
import { FormValidator } from 'src/app/core/validators/form.validator';
import { ValidationMessage, forgetPasswordRequirements } from 'src/app/core/forms';
import { changeStatus, getObjectKeys } from 'src/app/core/helpers';

@UntilDestroy()
@Component({
  selector: 'forget-password-page',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordPage {
  hideNewPassword = true;
  hidePasswordConfirmation = true;
  formError = "";
  isSendingCode = false;
  isResettingPassword = false;

  private nextForgetPwTimeSubject = new BehaviorSubject<Date | null>(null);
  nextForgetPwTime$ = this.nextForgetPwTimeSubject.asObservable();

  showBtnGetCode$ = combineLatest([
    this.nextForgetPwTime$,
    timer(0, 1000)
  ]).pipe(
    map(([nextForgetPwTime]) => {
      if (!nextForgetPwTime) {
        return true;
      }

      return nextForgetPwTime.toString() < new Date().toISOString();
    }),
    untilDestroyed(this)
  );

  // Form requirements
  codeRequirements = forgetPasswordRequirements.code.requirements;
  newPasswordRequirements = forgetPasswordRequirements.newPassword.requirements;
  confirmPasswordRequirements = forgetPasswordRequirements.passwordConfirmation.requirements;

  // Form validation messages
  emailValidationMessages: ValidationMessage = forgetPasswordRequirements.email.validationMsg;
  codeValidationMessages: ValidationMessage = forgetPasswordRequirements.code.validationMsg;
  newPasswordValidationMessages: ValidationMessage = forgetPasswordRequirements.newPassword.validationMsg;
  confirmPasswordValidationMessages: ValidationMessage = forgetPasswordRequirements.passwordConfirmation.validationMsg;

  emailControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  resetPasswordForm = new FormGroup({
    code: new FormControl('', [
      Validators.required,
      Validators.minLength(this.codeRequirements.minlength),
      Validators.maxLength(this.codeRequirements.maxlength)
    ]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(this.newPasswordRequirements.minlength),
      Validators.maxLength(this.newPasswordRequirements.maxlength)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required
    ])
  }, [
    FormValidator.changePasswordMatched
  ])

  getObjectKeys = getObjectKeys;

  constructor(
    private router: Router,
    private usersService: UsersService,
    private snackbar: MatSnackBar,
  ) {}

  /** Send code to reset password */
  onSendCode() {
    if (!this.emailControl.valid) {
      this.formError = this.emailValidationMessages[getObjectKeys(this.emailControl.errors)[0]];
    } else if (this.emailControl.valid && !this.isSendingCode) {
      this.isSendingCode = changeStatus(this.isSendingCode);
      this.usersService.forgetPassword(this.emailControl.value as string).pipe(
        tap((user) => {
          this.handleSendCodeSuccess(user);
        }, error => {
          this.handleSendCodeFail(error);
        }),
        finalize(() => this.isSendingCode = changeStatus(this.isSendingCode)),
        untilDestroyed(this)
      ).subscribe();
    }
  }

  /** Reset password */
  onResetPassword() {
    if (!this.resetPasswordForm.valid) {
      if (this.resetPasswordForm.hasError("passwordNotMatch")) {
        this.formError = "Passwords are not matched";
      }
    } else if (this.emailControl.invalid) {
      this.formError = this.emailValidationMessages[getObjectKeys(this.emailControl.errors)[0]];
    } else if (
      this.resetPasswordForm.valid
      && this.emailControl.valid
      && !this.isResettingPassword
    ) {
      this.isResettingPassword = changeStatus(this.isResettingPassword);
      this.usersService.resetPassword(
        this.emailControl.value as string,
        this.resetPasswordForm.value.code as string,
        this.resetPasswordForm.value.newPassword as string
      ).pipe(
        tap(() => {
          this.router.navigate(['/']);
        }, (error) => {
          this.handleResetPasswordFail(error);
        }),
        finalize(() => {
          this.isResettingPassword = changeStatus(this.isResettingPassword);
        }),
        untilDestroyed(this)
      ).subscribe();
    }
  }

  onPressEnter(event: KeyboardEvent) {
    if (event.key === "Enter" && !this.isSendingCode) {
      this.onSendCode();
    }
  }

  private handleSendCodeSuccess(user: User) {
    this.nextForgetPwTimeSubject.next(user.next_forget_password_time);
    let snackbarMessage = "";

    if (user.next_forget_password_time.toString() > new Date().toISOString()) {
      snackbarMessage = "You have requested a new code. Please wait a while before requesting again.";
    } else {
      snackbarMessage = "Reset password code was send to your email";
    }
    this.snackbar.open('Reset password code was send to your email', 'x', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  private handleSendCodeFail(error: any) {
    const errorResponse: ErrorResponse = error.error;
    let errorMessage = errorResponse.message ?? "Unexpected error happened";

    // Handle if server return more than 1 error
    if (typeof errorMessage === "object") {
      errorMessage = errorMessage[0];
    }

    // Show error message
    this.formError = errorMessage;
    this.snackbar.open(errorMessage, "x", {
      duration: 4000,
      horizontalPosition: "right",
      verticalPosition: "top"
    })
  }

  private handleResetPasswordFail(error: any) {
    const errorResponse: ErrorResponse = error.error;
    let errorMessage = errorResponse.message ?? "Unexpected error happened";

    // Handle if server return more than 1 error
    if (typeof errorMessage === "object") {
      errorMessage = errorMessage[0];
    }

    // Show error message
    this.formError = errorMessage;
    this.snackbar.open(errorMessage, "x", {
      duration: 4000,
      horizontalPosition: "right",
      verticalPosition: "top"
    })
  }
}
