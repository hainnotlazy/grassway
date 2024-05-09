import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { loginRequirements } from 'src/app/core/constants/form-requirement.const';
import { getObjectKeys } from 'src/app/core/helpers/utils';
import { ValidationMessage } from 'src/app/core/interfaces/form.interface';

@Component({
  selector: 'login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  hidePassword = true;

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
}
