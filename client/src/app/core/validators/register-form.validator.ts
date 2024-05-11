import { AbstractControl } from "@angular/forms";

export class RegisterFormValidator {
  static passwordMatched(form: AbstractControl) {
    const { password, confirmPassword } = form.value;

    return password === confirmPassword ? null : { passwordNotMatch: true }
  }

  static changePasswordMatched(form: AbstractControl) {
    const { newPassword, confirmPassword } = form.value;

    return newPassword === confirmPassword ? null : { passwordNotMatch: true }
  }
}
