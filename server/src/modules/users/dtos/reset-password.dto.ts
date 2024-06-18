import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, Length, MaxLength, MinLength } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty({
    description: "User's email",
  })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.toLowerCase())
  email: string;

  @ApiProperty({
    description: "Reset password code",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  code: string;

  @ApiProperty({
    description: "New password",
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(255)
  @Transform((params: TransformFnParams) => params.value.trim())
  new_password: string;
}