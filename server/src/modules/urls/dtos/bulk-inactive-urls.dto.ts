import { IsArray, IsBoolean } from "class-validator";

export class BulkInactiveUrlsDto {
  @IsArray()
  ids: string[];

  @IsBoolean()
  active: boolean;
}