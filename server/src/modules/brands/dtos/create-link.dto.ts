import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class CreateLinkDto {
  @ApiProperty({
    description: "Origin url",
    type: String
  })
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => {
    value = value?.trim();
    
    // Add prefix http|https if not present
    if (!value.startsWith("http://") && !value.startsWith("https://")) {
      return `https://${value}`;
    }
    return value;
  })
  origin_url: string;
  
  @ApiPropertyOptional({
    description: "Title of shortened url",
    type: String
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  title?: string;

  @ApiPropertyOptional({
    description: "Description of shortened url",
    type: String
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  description?: string;

  @ApiPropertyOptional({
    description: "Custom back half of shortened url",
    type: String
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  @Transform(({ value }: TransformFnParams) => value ? value?.trim() : null)
  custom_back_half?: string;

  @ApiPropertyOptional({
    description: "Password of shortened url",
    type: String
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  password?: string;
}