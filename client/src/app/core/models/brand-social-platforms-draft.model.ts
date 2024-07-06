import { BrandSocialPlatformsBase } from "./brand-base.model";
import { BrandDraft } from "./brand-draft.model";

export interface BrandSocialPlatformsDraft extends BrandSocialPlatformsBase {
  [key: string]: string | number | Date | BrandDraft | undefined;
  brand_id: string;
  brand_draft?: BrandDraft;
}
