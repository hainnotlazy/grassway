import { ApiProperty } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class BulkSetTagUrlsDto {
  @ApiProperty({
    description: "Links's id",
    type: Number
  })
  @IsArray()
  ids: number[];

  @ApiProperty({
    description: "Tag's id",
    type: Number
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  tag_id: number;

  @ApiProperty({
    description: "Add or remove tag from link(s)",
    type: Boolean
  })
  @IsBoolean()
  @IsNotEmpty()
  add_tag: boolean;
}