import { AbstractControl } from "@angular/forms";

export class FormValidator {
  static validUrl(control: AbstractControl) {
    const value = control.value;

    // Check value is valid url
    const regexPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

    return regexPattern.test(value) ? null : { validUrl: true };
  }

  static passwordMatched(form: AbstractControl) {
    const { password, confirmPassword } = form.value;

    return password === confirmPassword ? null : { passwordNotMatch: true }
  }

  static changePasswordMatched(form: AbstractControl) {
    const { newPassword, confirmPassword } = form.value;

    return newPassword === confirmPassword ? null : { passwordNotMatch: true }
  }
}
