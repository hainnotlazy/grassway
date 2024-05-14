import { ApiProperty } from "@nestjs/swagger";

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