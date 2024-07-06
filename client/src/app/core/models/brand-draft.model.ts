import { BrandBase } from "./brand-base.model";
import { BrandBlockDraft } from "./brand-block-draft.model";
import { BrandSocialPlatformsDraft } from "./brand-social-platforms-draft.model";
import { Brand } from "./brand.model";

export interface BrandDraft extends BrandBase {
  brand_id: string;
  brand?: Brand;
  blocks?: BrandBlockDraft[];
  social_platforms?: BrandSocialPlatformsDraft;
}
