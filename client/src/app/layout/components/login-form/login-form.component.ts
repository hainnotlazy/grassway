import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { noop } from 'rxjs';
import { loginRequirements } from 'src/app/core/constants/form-requirement.const';
import { getObjectKeys } from 'src/app/core/helpers/utils';
import { AuthResponse } from 'src/app/core/interfaces/auth-response.interface';
import { ErrorResponse } from 'src/app/core/interfaces/error-response.interface';
import { ValidationMessage } from 'src/app/core/interfaces/form.interface';
import { AuthService } from 'src/app/core/serivces/auth.service';
import { setAccessToken } from 'src/app/core/utils/local-storage.util';

@UntilDestroy()
@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  formError = "";
  hidePassword = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackbar: MatSnackBar
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
    if (this.loginForm.valid) {
      this.authService.login(
        this.loginForm.value.username as string,
        this.loginForm.value.password as string
      ).pipe(
        untilDestroyed(this)
      ).subscribe(
        // TODO: Handle if login success
        this.handleLoginSuccess.bind(this),
        this.handleLoginFail.bind(this)
      );
    }
  }

  handleLoginSuccess(data: AuthResponse) {
    const accessToken = data.access_token;

    setAccessToken(accessToken);
    // TODO: Navigate to user home page
    // this.router.navigate(['/']);
  }

  handleLoginFail(error: any) {
    const errorResponse: ErrorResponse = error.error;
    const errorMessage = errorResponse.message ?? "Unexpected error happened";
    this.formError = errorMessage;
    this.snackbar.open(errorMessage, "x", {
      duration: 4000,
      horizontalPosition: "right",
      verticalPosition: "top"
    })
  }
}
