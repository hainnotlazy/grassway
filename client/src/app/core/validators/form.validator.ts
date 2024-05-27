import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { UrlsService } from "../services/urls.service";
import { Observable, debounceTime, distinctUntilChanged, first, map, of, switchMap } from "rxjs";

export class FormValidator {
  static validUrl(control: AbstractControl) {
    const value = control.value;
    if (value === "") return null;

    // Check value is valid url
    const regexPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

    return regexPattern.test(value) ? null : { validUrl: true };
  }

  // Check if custom back half is existed
  static customBackHalfExisted(urlsService: UrlsService, currentCustomBackHalf?: string): AsyncValidatorFn {
    return control => {
      if (!control.value) return of(null);

      return control.valueChanges.pipe(
        debounceTime(150),
        distinctUntilChanged(),
        switchMap(value => urlsService.validateCustomBackHalf(value)),
        map(response => response ? null : { existed: true }),
        first()
      );
    }
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
