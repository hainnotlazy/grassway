import { changeStatus, getObjectKeys } from 'src/app/core/helpers/utils';
import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { forgetPasswordRequirements } from 'src/app/core/constants/user-form-requirement.const';
import { ValidationMessage } from 'src/app/core/interfaces/form.interface';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, tap } from 'rxjs';
import { UsersService } from 'src/app/core/services/users.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorResponse } from 'src/app/core/interfaces/error-response.interface';
import { HttpClient } from '@angular/common/http';

@UntilDestroy()
@Component({
  selector: 'forget-password-page',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordPage {
  formError = "";
  isProcessing = false;

  // Form validation messages
  emailValidationMessages: ValidationMessage = forgetPasswordRequirements.email.validationMsg;

  emailControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  getObjectKeys = getObjectKeys;

  constructor(
    private router: Router,
    private usersService: UsersService,
    private snackbar: MatSnackBar,
    private httpClient: HttpClient
  ) {}

  /** Send code to reset password */
  onSendCode() {
    if (!this.emailControl.valid) {
      this.formError = this.emailValidationMessages[getObjectKeys(this.emailControl.errors)[0]];
      return;
    } else if (this.emailControl.valid && !this.isProcessing) {
      this.isProcessing = changeStatus(this.isProcessing);
      this.usersService.forgetPassword(this.emailControl.value as string).pipe(
        tap(() => {
          this.snackbar.open('Reset password code was send to your email', 'x', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          this.router.navigate(['/reset-password']);
        }, error => {
          this.handleSendCodeFail(error);
        }),
        finalize(() => this.isProcessing = changeStatus(this.isProcessing)),
        untilDestroyed(this)
      ).subscribe();
    }
  }

  onPressEnter(event: KeyboardEvent) {
    if (event.key === "Enter" && !this.isProcessing) {
      this.onSendCode();
    }
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
}
