import { BrandBlockBase } from "./brand-base.model";
import { BrandDraft } from "./brand-draft.model";
import { Url } from "./url.model";

export interface BrandBlockDraft extends BrandBlockBase {
  id: number;
  brand_id: string;
  brand_draft?: BrandDraft;
  url?: Url;
}
