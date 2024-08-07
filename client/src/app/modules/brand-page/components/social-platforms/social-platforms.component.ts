import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SOCIAL_PLATFORMS_COLORED, SOCIAL_PLATFORMS_DEFAULT, SOCIAL_PlATFORMS_NEXT_GEN, SocialPlatform } from 'src/app/core/constants/social-platforms.constant';
import { BrandSocialPlatformsBase, SocialIconStyle } from 'src/app/core/models';

@Component({
  selector: 'app-social-platforms',
  templateUrl: './social-platforms.component.html',
  styleUrls: ['./social-platforms.component.scss'],
  host: {
    class: "flex flex-wrap sm:w-auto w-3/4 mx-auto items-center justify-center gap-3 select-none"
  }
})
export class SocialPlatformsComponent implements OnInit, OnChanges {
  SOCIAL_PLATFORMS: SocialPlatform[] = [];
  readonly socialIconStyle = SocialIconStyle;
  @Input() socialPlatforms!: BrandSocialPlatformsBase;

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    this.renderSocialPlatforms();
  }

  private renderSocialPlatforms() {
    this.SOCIAL_PLATFORMS = this.getSocialPlatforms();

    for (let i = 0; i < this.SOCIAL_PLATFORMS.length; i++) {
      const platform = this.SOCIAL_PLATFORMS[i];
      const platformName = platform.name;

      // @ts-ignore
      this.SOCIAL_PLATFORMS[i].destination = this.socialPlatforms[platformName];
    }
    this.sortPlatforms(this.SOCIAL_PLATFORMS);
  }

  private getSocialPlatforms() {
    if (this.socialPlatforms.icon_style === SocialIconStyle.COLOR) {
      return SOCIAL_PLATFORMS_COLORED;
    } else if (
      this.socialPlatforms.icon_style === SocialIconStyle.BLACK ||
      this.socialPlatforms.icon_style === SocialIconStyle.WHITE
    ) {
      return SOCIAL_PLATFORMS_DEFAULT;
    } else {
      return SOCIAL_PlATFORMS_NEXT_GEN;
    }
  }

  private sortPlatforms(platforms: SocialPlatform[]) {
    return platforms.sort((a, b) => {
      const platformA = a.name;
      const platformB = b.name;

      // @ts-ignore
      return this.socialPlatforms[`${platformB}_order`] - this.socialPlatforms[`${platformA}_order`];
    })
  }

  getIconClassNames(platformIcon: string) {
    return `text-2xl ${platformIcon} ${this.isWhiteIconStyle() ? 'text-white' : 'text-black'}`;
  }

  isWhiteIconStyle() {
    return (
      this.socialPlatforms.icon_style === SocialIconStyle.WHITE
      || this.socialPlatforms.icon_style === SocialIconStyle.WHITE_FILLED
    );
  }
}
