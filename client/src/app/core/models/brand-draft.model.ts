import { BrandBase } from "./brand-base.model";
import { BrandSocialPlatformsDraft } from "./brand-social-platforms-draft.model";
import { Brand } from "./brand.model";

export interface BrandDraft extends BrandBase {
  brand_id: string;
  brand?: Brand;
  social_platforms?: BrandSocialPlatformsDraft;
}
