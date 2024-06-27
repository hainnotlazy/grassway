import { Transform, TransformFnParams } from "class-transformer";
import { IsEnum, IsHexColor, IsOptional, IsString, Length } from "class-validator";
import { BlockShadow, BlockShape, BrandFont, BrandLayout } from "src/entities/brand.enum";

export class UpdateBrandDesignDto {
  @IsString()
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  title?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  description?: string;
  
  @IsString()
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  prefix?: string;

  @IsOptional()
  logo: any;

  @IsEnum(BrandLayout)
  @IsOptional()
  layout?: BrandLayout;

  @IsHexColor()
  @Length(7, 7)
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  header_color?: string;

  @IsHexColor()
  @Length(7, 7)
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  background_color?: string;

  @IsHexColor()
  @Length(7, 7)
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  title_color?: string;

  @IsHexColor()
  @Length(7, 7)
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  description_color?: string;
  
  @IsEnum(BlockShape)
  @IsOptional()
  block_shape?: BlockShape;

  @IsEnum(BlockShadow)
  @IsOptional()
  block_shadow?: BlockShadow;

  @IsHexColor()
  @Length(7, 7)
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  block_color?: string;

  @IsHexColor()
  @Length(7, 7)
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  block_text_color?: string;

  @IsEnum(BrandFont)
  @IsOptional()
  font?: BrandFont;
}