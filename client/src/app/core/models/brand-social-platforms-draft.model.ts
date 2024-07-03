import { BrandSocialPlatformsBase } from "./brand-base.model";

export interface BrandSocialPlatformsDraft extends BrandSocialPlatformsBase {
  [key: string]: string | number | Date;
  brand_id: string;
}
