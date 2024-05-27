import { Transform, TransformFnParams } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateShortenUrlDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  description: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  custom_back_half: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  password: string;

  @IsBoolean()
  @IsOptional()
  is_active: boolean;
}