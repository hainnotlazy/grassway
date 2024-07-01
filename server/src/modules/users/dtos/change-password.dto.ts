import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ChangePasswordDto {
  @ApiProperty({
    description: "Current password of user",
    type: String
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: "Password must be at least 5 characters" })
  @MaxLength(255, { message: "Password must be at most 255 characters" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  password: string;

  @ApiProperty({
    description: "New password of user",
    type: String
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: "Password must be at least 5 characters" })
  @MaxLength(255, { message: "Password must be at most 255 characters" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  new_password: string;
}