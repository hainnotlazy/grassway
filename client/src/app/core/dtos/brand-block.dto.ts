import { BlockImageRatio, BlockType } from "../models";

export interface BrandBlockDto {
  type? : BlockType;
  title: string;
  description?: string;
  image?: any;
  image_ratio?: BlockImageRatio;
  order?: number;
  youtube_url?: string;
}
