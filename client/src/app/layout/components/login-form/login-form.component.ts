import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { tap, finalize } from 'rxjs';
import { ValidationMessage, loginRequirements } from 'src/app/core/forms';
import { setAccessToken, changeStatus, getObjectKeys } from 'src/app/core/helpers';
import { AuthResponse } from 'src/app/core/interfaces/auth-response.interface';
import { ErrorResponse } from 'src/app/core/interfaces/error-response.interface';
import { AuthService } from 'src/app/core/services';

@UntilDestroy()
@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  formError = "";
  hidePassword = true;
  isProcessing = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  // Form requirements
  usernameRequirements = loginRequirements.username.requirements;
  passwordRequirements = loginRequirements.password.requirements;

  // Form validation messages
  usernameValidationMessages: ValidationMessage = loginRequirements.username.validationMsg;
  passwordValidationMessages: ValidationMessage = loginRequirements.password.validationMsg;

  getObjectKeys = getObjectKeys;

  loginForm = new FormGroup({
    username: new FormControl("", [
      Validators.required,
      Validators.minLength(this.usernameRequirements.minlength),
      Validators.maxLength(this.usernameRequirements.maxlength)
    ]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(this.passwordRequirements.minlength),
      Validators.maxLength(this.passwordRequirements.maxlength)
    ])
  });

  onSubmit() {
    if (this.loginForm.valid && !this.isProcessing) {
      this.isProcessing = changeStatus(this.isProcessing);
      this.authService.login(
        this.loginForm.value.username as string,
        this.loginForm.value.password as string
      ).pipe(
        tap((data) => {
          this.handleLoginSuccess(data);
        }, (error) => {
          this.handleLoginFail(error);
        }),
        finalize(() => {
          this.isProcessing = changeStatus(this.isProcessing);
        }),
        untilDestroyed(this)
      ).subscribe();
    }
  }

  onForgetPassword() {
    this.dialog.closeAll();
    this.router.navigate(['/forget-password']);
  }

  private handleLoginSuccess(data: AuthResponse) {
    const accessToken = data.access_token;

    setAccessToken(accessToken);
    this.router.navigate(['/u/links']);
  }

  private handleLoginFail(error: any) {
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
