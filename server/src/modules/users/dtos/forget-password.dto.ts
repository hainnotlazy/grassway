import { Transform, TransformFnParams } from "class-transformer";
import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.toLowerCase())
  email: string;
}