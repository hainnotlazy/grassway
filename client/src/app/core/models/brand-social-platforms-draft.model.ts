import { SocialIconPosition, SocialIconStyle } from "./brand.enum";

export interface BrandSocialPlatformsDraft {
  brand_id: string;
  icon_style: SocialIconStyle;
  icon_position: SocialIconPosition;
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  tiktok: string;
  linkedin: string;
  discord: string;
  github: string;
  website: string;
  facebook_order: number;
  instagram_order: number;
  twitter_order: number;
  youtube_order: number;
  tiktok_order: number;
  linkedin_order: number;
  discord_order: number;
  github_order: number;
  website_order: number;
  updated_at: Date;
}
