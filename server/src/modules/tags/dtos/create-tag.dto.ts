import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  name: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  description: string;

  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  icon: string;
}