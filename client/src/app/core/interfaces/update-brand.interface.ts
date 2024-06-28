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
