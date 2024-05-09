import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: "Username must be at least 5 characters" })
  @MaxLength(255, { message: "Username must be at most 255 characters" })
  username: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: "Password must be at least 5 characters" })
  @MaxLength(255, { message: "Password must be at most 255 characters" })
  password: string;
}