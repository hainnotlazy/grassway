import { Brand, Tag, Url } from "../models";

export interface EditLinkDialogDto {
  brand: Brand | null;
  url: Url;
  tags?: Tag[];
}
