import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";

export class BulkExportCsvDto {
  @ApiProperty({
    description: "Links's id",
    type: [String]
  })
  @IsArray()
  ids: string[];
}