import { IsString, Length, MaxLength, MinLength } from "class-validator";

export class VerifyEmailDto {
  @IsString()
  @Length(6, 6)
  code: string
}