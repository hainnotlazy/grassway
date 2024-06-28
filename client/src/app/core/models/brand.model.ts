import { BrandDraft } from "./brand-draft.model";
import { BrandMember } from "./brand-member.model";
import { BrandSocialPlatforms } from "./brand-social-platforms.model";
import { BlockShadow, BlockShape, BrandFont, BrandLayout } from "./brand.enum";

export interface Brand {
  id: string;
  social_platforms?: BrandSocialPlatforms;
  members?: BrandMember[];
  draft?: BrandDraft;
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
  created_at: Date;
  updated_at: Date;
}
