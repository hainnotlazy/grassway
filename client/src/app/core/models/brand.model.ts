import { BrandMember } from "./brand-member.model";
import { BrandSocialPlatforms } from "./brand-social-platforms.model";

export interface Brand {
  id: string;
  social_platforms: BrandSocialPlatforms;
  members: BrandMember[];
  title: string;
  description: string;
  prefix: string;
  logo: string;
  qr_code_background_color: string;
  qr_code_foreground_color: string;
  created_at: Date;
  updated_at: Date;
}
