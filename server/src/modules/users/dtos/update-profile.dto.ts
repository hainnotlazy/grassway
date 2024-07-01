import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export class UpdateProfileDto {
  @ApiPropertyOptional({
    description: "Fullname of user",
    default: "Hain",
    type: String
  })
  @IsOptional()
  @IsString()
  @MinLength(3, { message: "Fullname must have more than 3 characters" })
  @MaxLength(255, { message: "Fullname must have less than 255 characters" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  fullname?: string;

  @ApiPropertyOptional({
    description: "Bio of user",
    default: "Grassway - URL Shortener",
    type: String
  })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: "Bio must have less than 255 characters" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  bio?: string;

  @ApiPropertyOptional({
    description: "Phone number of user",
    default: "0123456789",
    type: String
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  phone?: string;

  @ApiPropertyOptional({
    description: "Date of birth of user (YYYY-MM-DD)",
    default: "2001-01-01",
    type: Date
  })
  @IsOptional()
  dob?: Date;

  @ApiPropertyOptional({
    description: "Gender of user",
    default: "male",
    enum: Gender,
    enumName: "GenderEnum"
  })
  @IsOptional()
  @IsEnum(Gender, { message: "Gender must be male, female or other" })
  gender?: Gender;
  
  @ApiPropertyOptional({
    description: "Avatar of user",
    type: String,
    format: "binary"
  })
  @IsOptional()
  avatar?: any;
}