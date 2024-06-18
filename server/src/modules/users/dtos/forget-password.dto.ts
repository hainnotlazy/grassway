import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgetPasswordDto {
  @ApiProperty({
    description: "User's email",
  })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.toLowerCase())
  email: string;
}