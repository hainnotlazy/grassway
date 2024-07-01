import { Transform, TransformFnParams } from "class-transformer";
import { IsOptional, IsString, Matches } from "class-validator";

export class UpdateSocialPlatformsDto {
  @IsString()
  @IsOptional()
  @Matches(
    /^(https?:\/\/)?(www\.)?facebook\.com\/.+$/, 
    { message: "Invalid facebook url" }
  )
  @Transform(({ value }: TransformFnParams) => value?.trim())
  facebook: string;

  @IsString()
  @IsOptional()
  @Matches(
    /^(https?:\/\/)?(www\.)?x\.com\/.+$/, 
    { message: "Invalid X (Formerly Twitter) url" }
  )
  @Transform(({ value }: TransformFnParams) => value?.trim())
  x: string;
  
  @IsString()
  @IsOptional()
  @Matches(
    /^(https?:\/\/)?(www\.)?instagram\.com\/.+$/, 
    { message: "Invalid instagram url" }
  )
  @Transform(({ value }: TransformFnParams) => value?.trim())
  instagram: string;
  
  @IsString()
  @IsOptional()
  @Matches(
    /^(https?:\/\/)?(www\.)?youtube\.com\/.+$/, 
    { message: "Invalid youtube url" }
  )
  @Transform(({ value }: TransformFnParams) => value?.trim())
  youtube: string;
  
  @IsString()
  @IsOptional()
  @Matches(
    /^(https?:\/\/)?(www\.)?linkedin\.com\/.+$/, 
    { message: "Invalid linkedin url" }
  )
  @Transform(({ value }: TransformFnParams) => value?.trim())
  linkedin: string;
  
  @IsString()
  @IsOptional()
  @Matches(
    /^(https?:\/\/)?(www\.)?discord\.gg\/.+$/, 
    { message: "Invalid discord url" }
  )
  @Transform(({ value }: TransformFnParams) => value?.trim())
  discord: string;
  
  @IsString()
  @IsOptional()
  @Matches(
    /^(https?:\/\/)?(www\.)?tiktok\.com\/.+$/, 
    { message: "Invalid tiktok url" }
  )
  @Transform(({ value }: TransformFnParams) => value?.trim())
  tiktok: string;
  
  @IsString()
  @IsOptional()
  @Matches(
    /^(https?:\/\/)?(www\.)?github\.com\/.+$/, 
    { message: "Invalid github url" }
  )
  @Transform(({ value }: TransformFnParams) => value?.trim())
  github: string;
  
  @IsString()
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  website: string;
}