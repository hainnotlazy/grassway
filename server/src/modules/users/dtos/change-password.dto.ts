import { ApiProperty } from "@nestjs/swagger";
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
  password: string;

  @ApiProperty({
    description: "New password of user",
    type: String
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5, { message: "Password must be at least 5 characters" })
  @MaxLength(255, { message: "Password must be at most 255 characters" })
  newPassword: string;
}