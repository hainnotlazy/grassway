import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateSocialPlatformsOrderDto {
  @IsNumber()
  @IsNotEmpty()
  facebook_order: number;

  @IsNumber()
  @IsNotEmpty()
  x_order: number;

  @IsNumber()
  @IsNotEmpty()
  instagram_order: number;

  @IsNumber()
  @IsNotEmpty()
  linkedin_order: number;

  @IsNumber()
  @IsNotEmpty()
  youtube_order: number;

  @IsNumber()
  @IsNotEmpty()
  tiktok_order: number; 

  @IsNumber()
  @IsNotEmpty()
  discord_order: number;

  @IsNumber()
  @IsNotEmpty()
  github_order: number;

  @IsNumber()
  @IsNotEmpty()
  website_order: number;
}