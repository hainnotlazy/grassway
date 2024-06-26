import { Brand } from "./brand.model";

export interface BrandSocialPlatforms {
  brand_id: string;
  brand: Brand;
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  tiktok: string;
  linkedin: string;
  discord: string;
  github: string;
  website: string;
  updated_at: Date;
}
