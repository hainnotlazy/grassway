import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class AccessProtectedUrlDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  password: string;
}