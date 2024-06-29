import { BrandSocialPlatformsBase } from "./brand-base.model";
import { Brand } from "./brand.model";

export interface BrandSocialPlatforms extends BrandSocialPlatformsBase {
  brand_id: string;
  brand?: Brand;
}
