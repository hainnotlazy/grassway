import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, distinctUntilChanged, filter, switchMap, take, tap } from 'rxjs';
import { SOCIAL_PLATFORMS_COLORED, SocialPlatform } from 'src/app/core/constants/social-platforms.constant';
import { UpdateSocialPlatformsDto } from 'src/app/core/dtos';
import { BrandSocialPlatformsDraft } from 'src/app/core/models';
import { BrandsService } from 'src/app/core/services';
import { FormValidator } from 'src/app/core/validators/form.validator';

@UntilDestroy()
@Component({
  selector: 'app-socials-form',
  templateUrl: './socials-form.component.html',
  styleUrls: ['./socials-form.component.scss'],
})
export class SocialsFormComponent implements OnInit {
  readonly DND_SOCIAL_PLATFORMS = SOCIAL_PLATFORMS_COLORED;
  brandId!: string;

  @Input() socialPlatforms!: BrandSocialPlatformsDraft;

  form = new FormGroup({
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
  ) {
    this.brandsService.currentBrand$.pipe(
      tap(brand => this.brandId = brand.id),
      take(1),
    ).subscribe();
  }

  ngOnInit() {
    this.form.patchValue(this.socialPlatforms);
    this.sortPlatforms();
    this.form.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      filter(() => this.form.valid),
      switchMap(data => this.brandsService.updateSocialPlatformsDraft(this.brandId, data as UpdateSocialPlatformsDto)),
      untilDestroyed(this)
    ).subscribe();
  }

  drop(event: CdkDragDrop<SocialPlatform[]>) {
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
    this.brandsService.updateSocialPlatformsDraftOrder(
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
      take(1)
    ).subscribe();
  }
}
