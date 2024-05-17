import { IsNotEmpty, IsString } from "class-validator";

export class ShortenUrlDto {
  @IsString()
  @IsNotEmpty()
  origin_url: string;
}