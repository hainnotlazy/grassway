import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, IsString, IsUrl } from "class-validator";

/** This DTO used for anonymous users to shorten url */
export class ShortenUrlDto {
  @ApiProperty({
    description: "Origin url",
    type: String
  })
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => {
    value = value?.trim();
    
    // Add prefix http|https if not present
    if (!value.startsWith("http://") && !value.startsWith("https://")) {
      return `https://${value}`;
    }
    return value;
  })
  origin_url: string;
}