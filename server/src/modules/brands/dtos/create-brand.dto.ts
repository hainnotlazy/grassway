import { Transform, TransformFnParams } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from "class-validator";

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  title: string;

  @IsString()
  @MaxLength(100)
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  description?: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9_-]+$/, { message: "Invalid prefix. Only letters and numbers allowed" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  prefix: string;

  @IsOptional()
  logo?: any;

  @IsString()
  @IsOptional()
  @Matches(
    /^(https?:\/\/)?(www\.)?facebook\.com\/.+$/, 
    { message: "Invalid facebook url" }
  )
  @Transform(({ value }: TransformFnParams) => value ? value.trim() : null)
  facebook: string;

  @IsString()
  @IsOptional()
  @Matches(
    /^(https?:\/\/)?(www\.)?instagram\.com\/.+$/, 
    { message: "Invalid instagram url" }
  )
  @Transform(({ value }: TransformFnParams) => value ? value.trim() : null)
  instagram?: string;

  @IsString()
  @IsOptional()
  @Matches(
    /^(https?:\/\/)?(www\.)?x\.com\/.+$/, 
    { message: "Invalid X (Formerly Twitter) url" }
  )
  @Transform(({ value }: TransformFnParams) => value ? value.trim() : null)
  x?: string;

  @IsString()
  @IsOptional()
  @Matches(
    /^(https?:\/\/)?(www\.)?youtube\.com\/.+$/, 
    { message: "Invalid youtube url" }
  )
  @Transform(({ value }: TransformFnParams) => value ? value.trim() : null)
  youtube?: string;

  @IsString()
  @IsOptional()
  @Matches(
    /^(https?:\/\/)?(www\.)?tiktok\.com\/.+$/, 
    { message: "Invalid tiktok url" }
  )
  @Transform(({ value }: TransformFnParams) => value ? value.trim() : null)
  tiktok?: string;

  @IsString()
  @IsOptional()
  @Matches(
    /^(https?:\/\/)?(www\.)?linkedin\.com\/.+$/, 
    { message: "Invalid linkedin url" }
  )
  @Transform(({ value }: TransformFnParams) => value ? value.trim() : null)
  linkedin?: string;

  @IsString()
  @IsOptional()
  @Matches(
    /^(https?:\/\/)?(www\.)?discord\.gg\/.+$/, 
    { message: "Invalid discord url" }
  )
  @Transform(({ value }: TransformFnParams) => value ? value.trim() : null)
  discord?: string;

  @IsString()
  @IsOptional()
  @Matches(
    /^(https?:\/\/)?(www\.)?github\.com\/.+$/, 
    { message: "Invalid github url" }
  )
  @Transform(({ value }: TransformFnParams) => value ? value.trim() : null)
  github?: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => {
    if (value) {
      value = value.trim();

      // Add prefix http|https if not present
      if (!value.startsWith("http://") && !value.startsWith("https://")) {
        return `https://${value}`;
      }
      return value;
    }

    return null;
  })
  website?: string;

  @IsArray()
  @IsOptional()
  invited_users?: number[];
}