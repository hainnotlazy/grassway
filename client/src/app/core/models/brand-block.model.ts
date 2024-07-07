import { BrandBlockBase } from "./brand-base.model";
import { Brand } from "./brand.model";
import { Url } from "./url.model";

export interface BrandBlock extends BrandBlockBase {
  id: number;
  brand_id: string;
  brand?: Brand;
  url?: Url;
}
