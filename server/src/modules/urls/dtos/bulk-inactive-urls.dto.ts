import { IsArray, IsBoolean } from "class-validator";

export class BulkChangeStatusUrlsDto {
  @IsArray()
  ids: string[];

  @IsBoolean()
  active: boolean;
}