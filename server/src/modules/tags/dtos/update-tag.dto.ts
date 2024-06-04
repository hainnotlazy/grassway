import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateTagDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  @Transform(({ value }) => value.trim())
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @Transform(({ value }) => value ? value.trim() : "")
  description: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  icon: string;
}