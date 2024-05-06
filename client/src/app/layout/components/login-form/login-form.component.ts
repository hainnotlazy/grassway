import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { loginRequirements } from 'src/app/core/constants/form-requirement.const';
import { getObjectKeys } from 'src/app/core/helpers/utils';
import { IValidationMessage } from 'src/app/core/interfaces/form.interface';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  usernameRequirements = loginRequirements.username.requirements;
  passwordRequirements = loginRequirements.password.requirements;

  usernameValidationMessages: IValidationMessage = loginRequirements.username.validationMsg;
  passwordValidationMessages: IValidationMessage = loginRequirements.password.validationMsg;

  getObjectKeys = getObjectKeys;

  loginForm = new FormGroup({
    username: new FormControl("", [
      Validators.required,
      Validators.minLength(this.usernameRequirements.minLength),
      Validators.maxLength(this.usernameRequirements.maxLength)
    ]),
    password: new FormControl("", [
      Validators.required,
      Validators.minLength(this.passwordRequirements.minLength),
      Validators.maxLength(this.passwordRequirements.maxLength)
    ])
  });
}
