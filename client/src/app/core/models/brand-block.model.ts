import { BrandBlockBase } from "./brand-base.model";
import { Brand } from "./brand.model";

export interface BrandBlock extends BrandBlockBase {
  id: number;
  brand_id: string;
  brand?: Brand;
}
