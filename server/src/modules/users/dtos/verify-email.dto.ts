import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length } from "class-validator";

export class VerifyEmailDto {
  @ApiProperty({
    description: "Email Verification Code",
    type: String
  })
  @IsString()
  @Length(6, 6)
  code: string
}