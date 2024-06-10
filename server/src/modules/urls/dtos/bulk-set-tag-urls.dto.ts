import { Transform, TransformFnParams } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class BulkSetTagUrlsDto {
  @IsArray()
  ids: number[];

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  tag_id: number;

  @IsBoolean()
  @IsNotEmpty()
  add_tag: boolean;
}