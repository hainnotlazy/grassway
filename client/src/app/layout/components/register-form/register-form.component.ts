import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize, tap } from 'rxjs';
import { registerRequirements } from 'src/app/core/constants/form-requirement.const';
import { setAccessToken } from 'src/app/core/helpers/local-storage.helper';
import { changeStatus, getObjectKeys } from 'src/app/core/helpers/utils';
import { AuthResponse } from 'src/app/core/interfaces/auth-response.interface';
import { ErrorResponse } from 'src/app/core/interfaces/error-response.interface';
import { ValidationMessage } from 'src/app/core/interfaces/form.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormValidator } from 'src/app/core/validators/form.validator';

@UntilDestroy()
@Component({
  selector: 'register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent {
  formError = "";
  hidePassword = true;
  hidePasswordConfirmation = true;
  isProcessing = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  // Form requirements
  usernameRequirements = registerRequirements.username.requirements;
  emailRequirements = registerRequirements.email.requirements;
  passwordRequirements = registerRequirements.password.requirements;
  confirmPasswordRequirements = registerRequirements.confirmPassword.requirements;

  // Form validation messages
  formValidationMessages: ValidationMessage = {
    passwordNotMatch: "Confirm password is not matched"
  }
  usernameValidationMessages: ValidationMessage = registerRequirements.username.validationMsg;
  emailValidationMessages: ValidationMessage = registerRequirements.email.validationMsg;
  passwordValidationMessages: ValidationMessage = registerRequirements.password.validationMsg;
  confirmPasswordValidationMessages: ValidationMessage = registerRequirements.confirmPassword.validationMsg;

  getObjectKeys = getObjectKeys;

  registerForm = new FormGroup({
    username: new FormControl("", [
      Validators.required,
      Validators.minLength(this.usernameRequirements.minlength),
      Validators.maxLength(this.usernameRequirements.maxlength)
    ]),
    email: new FormControl("", [
      Validators.email
    ]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(this.passwordRequirements.minlength),
      Validators.maxLength(this.passwordRequirements.maxlength)
    ]),
    confirmPassword: new FormControl("", [
      Validators.required
    ])
  }, [
    FormValidator.passwordMatched
  ]);

  onSubmit() {
    if (this.registerForm.errors) {
      for (let error of this.getObjectKeys(this.registerForm.errors)) {
        this.formError = this.formValidationMessages[error];
      }
    }

    if (this.registerForm.valid && !this.isProcessing) {
      this.isProcessing = changeStatus(this.isProcessing);
      this.authService.register(
        this.registerForm.value.username as string,
        this.registerForm.value.password as string,
        this.registerForm.value.email as string
      ).pipe(
        tap((data) => {
          this.handleRegisterSuccess(data);
        }, (error) => {
          this.handleRegisterFail(error);
        }),
        finalize(() => {
          this.isProcessing = changeStatus(this.isProcessing);
        }),
        untilDestroyed(this)
      ).subscribe();
    }
  }

  private handleRegisterSuccess(data: AuthResponse) {
    const accessToken = data.access_token;

    setAccessToken(accessToken);
    this.router.navigate(['/u/link']);
  }

  private handleRegisterFail(error: any) {
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
