import { getObjectValues } from 'src/app/core/helpers';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, distinctUntilChanged, filter, finalize, switchMap, take, tap } from 'rxjs';
import { SOCIAL_PLATFORMS_COLORED, SocialPlatform } from 'src/app/core/constants/social-platforms.constant';
import { UpdateSocialPlatformsDto } from 'src/app/core/dtos';
import { BrandSocialPlatformsDraft, SocialIconPosition, SocialIconStyle } from 'src/app/core/models';
import { BrandsDraftService, BrandsService } from 'src/app/core/services';
import { FormValidator } from 'src/app/core/validators/form.validator';

@UntilDestroy()
@Component({
  selector: 'app-socials-form',
  templateUrl: './socials-form.component.html',
  styleUrls: ['./socials-form.component.scss'],
})
export class SocialsFormComponent implements OnInit {
  readonly DND_SOCIAL_PLATFORMS = SOCIAL_PLATFORMS_COLORED;
  readonly SocialIconStyle = SocialIconStyle;
  readonly SocialIconPosition = SocialIconPosition;
  readonly getObjectValues = getObjectValues;

  brandId!: string;
  isProcessing = false;

  @Input() socialPlatforms!: BrandSocialPlatformsDraft;

  form = new FormGroup({
    icon_style: new FormControl(SocialIconStyle.COLOR),
    icon_position: new FormControl(SocialIconPosition.TOP),
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
    ]),
  })

  constructor(
    private brandsService: BrandsService,
    private brandsDraftService: BrandsDraftService
  ) {
    this.brandsService.currentBrand$.pipe(
      take(1),
      tap(brand => this.brandId = brand.id),
    ).subscribe();
  }

  ngOnInit() {
    this.form.patchValue(this.socialPlatforms);
    this.sortPlatforms();
    this.form.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      filter(() => this.form.valid),
      switchMap(data => this.brandsDraftService.updateSocialPlatforms(this.brandId, data as UpdateSocialPlatformsDto)),
      untilDestroyed(this)
    ).subscribe();
  }

  drop(event: CdkDragDrop<SocialPlatform[]>) {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;
    moveItemInArray(this.DND_SOCIAL_PLATFORMS, event.previousIndex, event.currentIndex);
    this.updatePlatformsOrder()
  }

  private sortPlatforms() {
    return this.DND_SOCIAL_PLATFORMS.sort((a, b) => {
      const platformA = a.name;
      const platformB = b.name;

      // @ts-ignore
      return this.socialPlatforms[`${platformB}_order`] - this.socialPlatforms[`${platformA}_order`];
    })
  }

  private getPlatformOrder(platformName: string) {
    return this.DND_SOCIAL_PLATFORMS.length - this.DND_SOCIAL_PLATFORMS.findIndex(platform => platform.name === platformName);
  }

  private updatePlatformsOrder() {
    this.brandsDraftService.updateSocialPlatformsOrder(
      this.brandId,
      {
        facebook_order: this.getPlatformOrder("facebook"),
        instagram_order: this.getPlatformOrder("instagram"),
        x_order: this.getPlatformOrder("x"),
        linkedin_order: this.getPlatformOrder("linkedin"),
        github_order: this.getPlatformOrder("github"),
        tiktok_order: this.getPlatformOrder("tiktok"),
        youtube_order: this.getPlatformOrder("youtube"),
        discord_order: this.getPlatformOrder("discord"),
        website_order: this.getPlatformOrder("website"),
      }
    ).pipe(
      finalize(() => this.isProcessing = false),
    ).subscribe();
  }
}
