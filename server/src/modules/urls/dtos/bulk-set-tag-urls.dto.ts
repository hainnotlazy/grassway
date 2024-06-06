import { Transform, TransformFnParams } from "class-transformer";
import { IsArray, IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class BulkSetTagUrlsDto {
  @IsArray()
  ids: string[];

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value.trim())
  tag_id: string;

  @IsBoolean()
  @IsNotEmpty()
  add_tag: boolean;
}