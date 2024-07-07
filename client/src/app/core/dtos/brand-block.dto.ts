import { BlockImageRatio, BlockType } from "../models";

export interface BrandBlockDto {
  [key: string]: any;
  type?: BlockType;
  title: string;
  description?: string;
  image?: any;
  image_ratio?: BlockImageRatio;
  order?: number;
  youtube_url?: string;
  url?: string;
  url_id?: number;
}
