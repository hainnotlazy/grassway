import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { registerRequirements } from 'src/app/core/constants/form-requirement.const';
import { getObjectKeys } from 'src/app/core/helpers/utils';
import { ValidationMessage } from 'src/app/core/interfaces/form.interface';
import { RegisterFormValidator } from 'src/app/core/validators/register-form.validator';

@Component({
  selector: 'register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent {
  formError = "";
  hidePassword = true;
  hidePasswordConfirmation = true;

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
    RegisterFormValidator.passwordMatched
  ]);

  onSubmit() {
    if (this.registerForm.errors) {
      for (let error of this.getObjectKeys(this.registerForm.errors)) {
        this.formError = this.formValidationMessages[error];
      }
    }
  }
}
