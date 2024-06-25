import { BreakpointObserver } from '@angular/cdk/layout';
import { STEPPER_GLOBAL_OPTIONS, StepperOrientation } from '@angular/cdk/stepper';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { FormValidator } from 'src/app/core/validators/form.validator';

@Component({
  selector: 'create-brand-page',
  templateUrl: './create-brand.component.html',
  styleUrls: ['./create-brand.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ]
})
export class CreateBrandPage {
  stepperOrientation: Observable<StepperOrientation>;

  basicInfoForm = new FormGroup({
    title: new FormControl("", [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255)
    ]),
    description: new FormControl("", [
      Validators.maxLength(255)
    ])
  });

  socialsForm = new FormGroup({
    facebook: new FormControl("", [
      Validators.maxLength(255),
      FormValidator.validSocialLink("facebook")
    ]),
    instagram: new FormControl("", [
      Validators.maxLength(255),
      FormValidator.validSocialLink("instagram")
    ]),
    twitter: new FormControl("", [
      Validators.maxLength(255),
      FormValidator.validSocialLink("twitter")
    ]),
    linkedin: new FormControl("", [
      Validators.maxLength(255),
      FormValidator.validSocialLink("linkedin")
    ]),
    github: new FormControl("", [
      Validators.maxLength(255),
      FormValidator.validSocialLink("github")
    ]),
    tiktok: new FormControl("", [
      Validators.maxLength(255),
      FormValidator.validSocialLink("tiktok")
    ]),
    youtube: new FormControl("", [
      Validators.maxLength(255),
      FormValidator.validSocialLink("youtube")
    ]),
    discord: new FormControl("", [
      Validators.maxLength(255),
      FormValidator.validSocialLink("discord")
    ]),
    website: new FormControl("", [
      Validators.maxLength(255),
      FormValidator.validUrl
    ])
  });

  logoControl = new FormControl(null);

  constructor(
    breakpointObserver: BreakpointObserver
  ) {
    this.stepperOrientation = breakpointObserver
      .observe(['(min-width: 1024px)'])
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }
}
