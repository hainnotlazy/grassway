import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateTagDto {
  @ApiProperty({
    description: "Tag name",
    type: String
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(255)
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiProperty({
    description: "Tag description",
    type: String
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  @Transform(({ value }) => value ? value.trim() : "")
  description: string;

  @ApiProperty({
    description: "Tag icon",
    type: String
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value.trim())
  icon: string;
}