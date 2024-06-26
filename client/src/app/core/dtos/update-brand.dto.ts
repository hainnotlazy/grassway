import { BlockShadow, BlockShape, BrandFont, BrandLayout } from "../models/brand.enum";

export interface UpdateBrandDesignDto {
  title?: string;
  description?: string;
  prefix?: string;
  logo?: any;
  layout?: BrandLayout;
  header_color?: string;
  background_color?: string;
  title_color?: string;
  description_color?: string;
  block_shape?: BlockShape;
  block_shadow?: BlockShadow;
  block_color?: string;
  block_text_color?: string;
  font?: BrandFont;
}

export interface UpdateSocialPlatformsOrderDto {
  facebook_order: number;
  instagram_order: number;
  x_order: number;
  youtube_order: number;
  tiktok_order: number;
  linkedin_order: number;
  discord_order: number;
  github_order: number;
  website_order: number;
}
