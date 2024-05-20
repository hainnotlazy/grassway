import { ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterUserDto {
  @ApiPropertyOptional({
    description: "Username of user",
    default: "hainkone",
    type: String  
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: "Username must be at least 5 characters" })
  @MaxLength(255, { message: "Username must be at most 255 characters" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  username: string;

  @ApiPropertyOptional({
    description: "Email of user",
    default: "hain6621.dev@gmail.com",
    type: String
  })
  @IsEmail()
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  email: string;

  @ApiPropertyOptional({
    description: "Password of user",
    default: "verysecurepw",
    type: String
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: "Password must be at least 5 characters" })
  @MaxLength(255, { message: "Password must be at most 255 characters" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  password: string;
}