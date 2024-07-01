import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform, TransformFnParams } from "class-transformer";
import { IsBoolean, IsHexColor, IsOptional, Length } from "class-validator";

export class UserSettingDto {
  @ApiProperty({
    description: "QR Code Background color",
    type: String
  })
  @IsHexColor()
  @Length(7, 7)
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  qr_code_background_color?: string;

  @ApiProperty({
    description: "QR Code Foreground color",
    type: String
  })
  @IsHexColor()
  @Length(7, 7)
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  qr_code_foreground_color?: string;

  @ApiProperty({
    description: "Show/Hide QR Code Logo",
    type: String
  })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value}: TransformFnParams) => {
    if (typeof value === 'string') {
      return value === 'true';
    } 
    return value;
  })
  qr_code_show_logo?: boolean;

  @ApiPropertyOptional({
    description: "QR Code Logo",
  })
  @IsOptional()
  logo?: any;
}