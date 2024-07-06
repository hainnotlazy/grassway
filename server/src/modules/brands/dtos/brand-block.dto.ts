import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { BlockImageRatio, BlockType } from "src/entities";

export class BrandBlockDto {
  @IsEnum(BlockType)
  @IsOptional()
  type?: BlockType;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  image?: any;

  @IsEnum(BlockImageRatio)
  @IsOptional()
  image_ratio?: BlockImageRatio;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsString()
  @IsOptional()
  youtube_url?: string;

  // @IsString()
  // @IsNotEmpty()
  // url: string;
}