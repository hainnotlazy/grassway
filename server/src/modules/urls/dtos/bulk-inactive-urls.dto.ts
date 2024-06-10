import { IsArray, IsBoolean } from "class-validator";

export class BulkChangeStatusUrlsDto {
  @IsArray()
  ids: number[];

  @IsBoolean()
  active: boolean;
}