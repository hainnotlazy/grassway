import { AbstractControl, AsyncValidatorFn, ValidationErrors } from "@angular/forms";
import { UrlsService } from "../services/urls.service";
import { Observable, debounceTime, distinctUntilChanged, filter, first, map, of, switchMap, tap } from "rxjs";
import { BrandsService } from "../services/brands.service";

export class FormValidator {
  private static readonly SOCIAL_PATTERN = {
    facebook: /^(https?:\/\/)?(www\.)?facebook\.com\/.+$/,
    instagram: /^(https?:\/\/)?(www\.)?instagram\.com\/.+$/,
    x: /^(https?:\/\/)?(www\.)?x\.com\/.+$/,
    linkedin: /^(https?:\/\/)?(www\.)?linkedin\.com\/.+$/,
    github: /^(https?:\/\/)?(www\.)?github\.com\/.+$/,
    tiktok: /^(https?:\/\/)?(www\.)?tiktok\.com\/.+$/,
    youtube: /^(https?:\/\/)?(www\.)?youtube\.com\/.+$/,
    discord: /^(https?:\/\/)?(www\.)?discord\.gg\/.+$/,
  }

  static validUrl(control: AbstractControl) {
    const value = control.value;
    if (!value) return null;

    // Check value is valid url
    const regexPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator

    return regexPattern.test(value) ? null : { validUrl: true };
  }

  static validSocialLink(
    platform: "facebook" | "instagram" | "x" | "linkedin" | "github" | "tiktok" | "youtube" | "discord"
  ) {
    return (control: AbstractControl): ValidationErrors | null => {
      const url = control.value;
      if (!url) return null;

      const pattern = this.SOCIAL_PATTERN[platform];
      if (pattern && !pattern.test(url)) {
        return { invalidSocialLink: true };
      }
      return null;
    };
  }

  static validYoutubeEmbedLink(control: AbstractControl) {
    const url = control.value;
    if (!url) return null;

    const pattern = /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/.+$/;
    if (pattern && !pattern.test(url)) {
      return { invalidYoutubeEmbedLink: true };
    }
    return null;
  }

  static brandPrefixExisted(brandsService: BrandsService, currentBrandPrefix?: string): AsyncValidatorFn {
    return control => {
      if (!control.value || control.value === currentBrandPrefix) return of(null);

      return control.valueChanges.pipe(
        debounceTime(150),
        distinctUntilChanged(),
        switchMap(value => brandsService.validateBrandPrefix(value)),
        map(response => response ? null : { existed: true }),
        first()
      );
    }
  }

  static customBackHalfExisted(urlsService: UrlsService, currentCustomBackHalf?: string): AsyncValidatorFn {
    return control => {
      if (!control.value || control.value === currentCustomBackHalf) return of(null);

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
