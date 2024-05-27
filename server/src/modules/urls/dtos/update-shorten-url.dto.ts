import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateShortenUrlDto {
  @ApiProperty({
    description: "Title",
    type: String
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  title: string;

  @ApiPropertyOptional({
    description: "Description", 
    type: String
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  description: string;

  @ApiPropertyOptional({
    description: "Custom back-half", 
    type: String
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  custom_back_half: string;

  @ApiPropertyOptional({
    description: "Password", 
    type: String
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  password: string;

  @ApiPropertyOptional({
    description: "Status", 
    type: Boolean
  })
  @IsBoolean()
  @IsOptional()
  is_active: boolean;
}