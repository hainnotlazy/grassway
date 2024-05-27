import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { MaxLength } from "class-validator";

/** DTO used only for describing swagger schemas */
export class LoginUserDto {
  @ApiProperty({
    description: "User username",
    example: "hainkone",
  })
  @MaxLength(255)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  username: string;

  @ApiProperty({
    description: "User password",
    example: "verysecurepw",
  })
  @MaxLength(255)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  password: string;
}