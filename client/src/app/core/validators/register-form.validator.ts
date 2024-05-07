import { AbstractControl } from "@angular/forms";

export class RegisterFormValidator {
  static passwordMatched(form: AbstractControl) {
    const { password, passwordConfirmation } = form.value;

    return password === passwordConfirmation ? null : { passwordNotMatch: true }
  }

  static changePasswordMatched(form: AbstractControl) {
    const { newPassword, passwordConfirmation } = form.value;

    return newPassword === passwordConfirmation ? null : { passwordNotMatch: true }
  }
}
