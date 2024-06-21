import { IsBoolean } from "class-validator";

export class ChangeNotificationStatusDto {
  @IsBoolean()
  is_read: boolean;
}