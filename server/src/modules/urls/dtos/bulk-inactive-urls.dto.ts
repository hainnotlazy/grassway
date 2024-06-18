import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean } from "class-validator";

export class BulkChangeStatusUrlsDto {
  @ApiProperty({
    description: "Links's id",
    type: [Number]
  })
  @IsArray()
  ids: number[];

  @ApiProperty({
    description: "Links's status",
    type: Boolean
  })
  @IsBoolean()
  active: boolean;
}