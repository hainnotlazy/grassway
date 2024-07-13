import { IsBoolean, IsNotEmpty } from "class-validator";

export class HandleInvitationDto {
  @IsBoolean()
  @IsNotEmpty()
  response: boolean;
}