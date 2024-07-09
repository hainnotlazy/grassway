import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SOCIAL_PLATFORMS_COLORED, SocialPlatform } from 'src/app/core/constants/social-platforms.constant';
import { BrandSocialPlatformsBase, SocialIconStyle } from 'src/app/core/models';

@Component({
  selector: 'app-social-platforms',
  templateUrl: './social-platforms.component.html',
  styleUrls: ['./social-platforms.component.scss'],
  host: {
    class: "flex items-center justify-center gap-2"
  }
})
export class SocialPlatformsComponent implements OnInit, OnChanges {
  readonly SOCIAL_PLATFORMS_COLORED = SOCIAL_PLATFORMS_COLORED;
  readonly socialIconStyle = SocialIconStyle;
  @Input() socialPlatforms!: BrandSocialPlatformsBase;

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    this.renderSocialPlatforms();
  }

  private renderSocialPlatforms() {
    for (let i = 0; i < SOCIAL_PLATFORMS_COLORED.length; i++) {
      const platform = SOCIAL_PLATFORMS_COLORED[i];
      const platformName = platform.name;

      // @ts-ignore
      this.SOCIAL_PLATFORMS_COLORED[i].destination = this.socialPlatforms[platformName];
    }
    this.sortPlatforms(this.SOCIAL_PLATFORMS_COLORED);
  }

  private sortPlatforms(platforms: SocialPlatform[]) {
    return platforms.sort((a, b) => {
      const platformA = a.name;
      const platformB = b.name;

      // @ts-ignore
      return this.socialPlatforms[`${platformB}_order`] - this.socialPlatforms[`${platformA}_order`];
    })
  }
}
