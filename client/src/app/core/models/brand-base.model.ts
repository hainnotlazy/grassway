import { BlockShadow, BlockShape, BrandFont, BrandLayout, SocialIconPosition, SocialIconStyle } from "./brand.enum";

export interface BrandBase {
  title: string;
  description: string;
  prefix: string;
  logo: string;
  qr_code_background_color: string;
  qr_code_foreground_color: string;
  layout: BrandLayout;
  header_color: string;
  background_color: string;
  title_color: string;
  description_color: string;
  block_shape: BlockShape;
  block_shadow: BlockShadow;
  block_color: string;
  block_text_color: string;
  font: BrandFont;
  updated_at: Date;
}

export interface BrandSocialPlatformsBase {
  icon_style: SocialIconStyle;
  icon_position: SocialIconPosition;
  facebook: string;
  instagram: string;
  x: string;
  youtube: string;
  tiktok: string;
  linkedin: string;
  discord: string;
  github: string;
  website: string;
  facebook_order: number;
  instagram_order: number;
  x_order: number;
  youtube_order: number;
  tiktok_order: number;
  linkedin_order: number;
  discord_order: number;
  github_order: number;
  website_order: number;
  updated_at: Date;
}
