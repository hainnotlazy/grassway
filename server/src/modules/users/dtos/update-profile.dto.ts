import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: "Fullname must have more than 3 characters" })
  @MaxLength(255, { message: "Fullname must have less than 255 characters" })
  fullname: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: "Bio must have less than 255 characters" })
  bio: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  dob: Date;

  @IsOptional()
  @IsEnum(["male", "female", "other"], { message: "Gender must be male, female or other" })
  gender: string;
}