import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class AccessProtectedUrlDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  password: string;
}