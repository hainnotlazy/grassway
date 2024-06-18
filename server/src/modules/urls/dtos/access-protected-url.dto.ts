import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class AccessProtectedUrlDto {
  @ApiProperty({
    description: "Link's Password",
    type: String
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Transform(({ value }: TransformFnParams) => value?.trim())
  password: string;
}