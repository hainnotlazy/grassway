import { IsArray } from "class-validator";

export class BulkExportCsvDto {
  @IsArray()
  ids: string[];
}