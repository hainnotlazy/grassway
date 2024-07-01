import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { BrandSocialPlatformsBase } from 'src/app/core/models/brand-base.model';
import { BrandSocialPlatformsDraft } from 'src/app/core/models/brand-social-platforms-draft.model';
import { SocialIconPosition, SocialIconStyle } from 'src/app/core/models/brand.enum';

// interface SocialPlatform {
//   name: string;
//   order: number;
//   icon: string;
// }

@Component({
  selector: 'app-socials-form',
  templateUrl: './socials-form.component.html',
  styleUrls: ['./socials-form.component.scss'],
})
export class SocialsFormComponent {
  // readonly SOCIAL_PLATFORMS: string[] = [
  //   'facebook',
  //   'instagram',
  //   'x',
  //   'youtube',
  //   'tiktok',
  //   'linkedin',
  //   'discord',
  //   'github',
  //   'website'
  // ];
  // @Input() socialPlatforms!: BrandSocialPlatformsBase;

  // dndSocialPlatforms?: SocialPlatform[];

  // private readonly sampleResponse: BrandSocialPlatformsDraft = {
  //   brand_id: "c6d2f0ec-363e-444e-b708-89693e785ed0",
  //   icon_style: SocialIconStyle.COLOR,
  //   icon_position: SocialIconPosition.TOP,
  //   facebook: "",
  //   instagram: "",
  //   twitter: "",
  //   youtube: "",
  //   tiktok: "",
  //   linkedin: "",
  //   discord: "",
  //   github: "",
  //   website: "",
  //   facebook_order: -1,
  //   instagram_order: -1,
  //   twitter_order: -1,
  //   youtube_order: -1,
  //   tiktok_order: -1,
  //   linkedin_order: -1,
  //   discord_order: 0,
  //   github_order: -1,
  //   website_order: 1,
  //   updated_at: new Date()
  // }

  // ngOnInit() {
  //   this.socialPlatforms = this.sortSocialPlatformsByOrder();
  //   console.log(this.socialPlatforms);
  // }

  // drop(event: CdkDragDrop<string[]>) {
  //   moveItemInArray(this.socialPlatforms, event.previousIndex, event.currentIndex);
  //   console.log(this.socialPlatforms);
  // }

  // private initSocialPlatformsHandling() {
  //   const orderMap = {
  //     facebook: this.socialPlatforms.facebook_order,
  //     instagram: this.socialPlatforms.instagram_order,
  //     twitter: this.socialPlatforms.twitter_order,
  //     youtube: this.socialPlatforms.youtube_order,
  //     tiktok: this.socialPlatforms.tiktok_order,
  //     linkedin: this.socialPlatforms.linkedin_order,
  //     discord: this.socialPlatforms.discord_order,
  //     github: this.socialPlatforms.github_order,
  //     website: this.socialPlatforms.website_order
  //   };
  // }

  // private sortSocialPlatformsByOrder() {
  //   const orderMap = {
  //     facebook: this.sampleResponse.facebook_order,
  //     instagram: this.sampleResponse.instagram_order,
  //     twitter: this.sampleResponse.twitter_order,
  //     youtube: this.sampleResponse.youtube_order,
  //     tiktok: this.sampleResponse.tiktok_order,
  //     linkedin: this.sampleResponse.linkedin_order,
  //     discord: this.sampleResponse.discord_order,
  //     github: this.sampleResponse.github_order,
  //     website: this.sampleResponse.website_order
  //   };

  //   return this.socialPlatforms.sort((a, b) => {
  //     // @ts-ignore
  //     return orderMap[b] - orderMap[a];
  //   });
  // }
}
