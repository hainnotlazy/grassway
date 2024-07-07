import { Transform, TransformFnParams } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, IsUrl, Length, Matches, MaxLength } from "class-validator";
import { BlockImageRatio, BlockType } from "src/entities";

export class BrandBlockDto {
  @IsEnum(BlockType)
  @IsOptional()
  type?: BlockType;

  @IsString()
  @IsNotEmpty()
  @Length(3, 80)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  @Transform(({ value }: TransformFnParams) => value?.trim())
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
  @Matches(
    /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/.+$/, 
    { message: "Invalid youtube embed url" }
  )
  @Transform(({ value }: TransformFnParams) => value?.trim())
  youtube_url?: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => {
    value = value?.trim();
    
    // Add prefix http|https if not present
    if (!value.startsWith("http://") && !value.startsWith("https://")) {
      return `https://${value}`;
    }
    return value;
  })
  url?: string;

  @IsNumberString()
  @IsOptional()
  url_id?: number;
}