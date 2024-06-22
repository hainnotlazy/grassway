import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export class ChangeNotificationStatusDto {
  @ApiProperty({
    description: "Is notification read",
    type: Boolean
  })
  @IsBoolean()
  is_read: boolean;
}