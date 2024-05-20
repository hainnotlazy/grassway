import { ApiProperty } from "@nestjs/swagger";

/** DTO used only for describing swagger schemas */
export class LoginUserDto {
  @ApiProperty({
    description: "User username",
    example: "hainkone",
  })
  username: string;

  @ApiProperty({
    description: "User password",
    example: "verysecurepw",
  })
  password: string;
}