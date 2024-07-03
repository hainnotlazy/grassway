import { BrandBase } from './brand-base.model';
import { BrandDraft } from "./brand-draft.model";
import { BrandMember } from "./brand-member.model";
import { BrandSocialPlatforms } from "./brand-social-platforms.model";

export interface Brand extends BrandBase {
  id: string;
  social_platforms?: BrandSocialPlatforms;
  members?: BrandMember[];
  draft?: BrandDraft;
  created_at: Date;
}
