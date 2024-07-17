import { BreakpointObserver } from '@angular/cdk/layout';
import { STEPPER_GLOBAL_OPTIONS, StepperOrientation } from '@angular/cdk/stepper';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, map, take, tap } from 'rxjs';
import { ErrorResponse } from 'src/app/core/interfaces';
import { Brand } from 'src/app/core/models';
import { BrandsService } from 'src/app/core/services';
import { FormValidator } from 'src/app/core/validators/form.validator';

@UntilDestroy()
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
      Validators.maxLength(80)
    ]),
    prefix: new FormControl("", [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
      FormValidator.validBrandPrefix
    ], FormValidator.brandPrefixExisted(this.brandsService)),
    description: new FormControl("", [
      Validators.maxLength(100)
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
    x: new FormControl("", [
      Validators.maxLength(255),
      FormValidator.validSocialLink("x")
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

  invitedUsers: number[] = [];

  constructor(
    private breakpointObserver: BreakpointObserver,
    private brandsService: BrandsService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {
    this.stepperOrientation = this.breakpointObserver
      .observe(['(min-width: 1024px)'])
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  onCreateBrand() {
    this.brandsService.createBrand({
      title: this.basicInfoForm.value.title as string,
      prefix: this.basicInfoForm.value.prefix as string,
      description: this.basicInfoForm.value.description as string,
      logo: this.logoControl.value,
      facebook: this.socialsForm.value.facebook as string,
      instagram: this.socialsForm.value.instagram as string,
      x: this.socialsForm.value.x as string,
      linkedin: this.socialsForm.value.linkedin as string,
      github: this.socialsForm.value.github as string,
      tiktok: this.socialsForm.value.tiktok as string,
      youtube: this.socialsForm.value.youtube as string,
      discord: this.socialsForm.value.discord as string,
      website: this.socialsForm.value.website as string,
      invited_users: this.invitedUsers
    }).pipe(
      tap((brand) => {
        this.handleCreateSuccess(brand);
      }, error => {
        this.handleCreateFailed(error);
      }),
      untilDestroyed(this)
    ).subscribe();
  }

  onAddInvitedUser(userId: number) {
    this.invitedUsers.push(userId);
  }

  onRemoveInvitedUser(userId: number) {
    this.invitedUsers = this.invitedUsers.filter(id => id !== userId);
  }

  private handleCreateSuccess(brand: Brand) {
    this.brandsService.brands$.pipe(
      take(1),
      tap(brands => this.brandsService.setBrands([brand, ...brands])),
    ).subscribe();
    this.snackbar.open("Brand created successfully", "x", {
      duration: 3000,
      verticalPosition: "top",
      horizontalPosition: "right"
    });
    this.router.navigate(["/u/brands", brand.id, "manage"]);
  }

  private handleCreateFailed(error: any) {
    const errorResponse: ErrorResponse = error.error;
    let errorMessage = errorResponse.message ?? "Unexpected error happened";

    // Handle if server return more than 1 error
    if (typeof errorMessage === "object") {
      errorMessage = errorMessage[0];
    }

    // Show error message
    this.snackbar.open(errorMessage, "x", {
      duration: 4000,
      horizontalPosition: "right",
      verticalPosition: "top"
    })
  }
}
