import { BrandBase } from './brand-base.model';
import { BrandBlock } from './brand-block.model';
import { BrandDraft } from "./brand-draft.model";
import { BrandMember } from "./brand-member.model";
import { BrandSocialPlatforms } from "./brand-social-platforms.model";

export interface Brand extends BrandBase {
  id: string;
  social_platforms?: BrandSocialPlatforms;
  members?: BrandMember[];
  blocks?: BrandBlock[];
  draft?: BrandDraft;
  qr_code_background_color: string;
  qr_code_foreground_color: string;
  created_at: Date;
}
