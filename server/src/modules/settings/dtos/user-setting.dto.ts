import { Transform, TransformFnParams } from "class-transformer";
import { IsBoolean, IsHexColor, IsOptional, Length } from "class-validator";

export class UserSettingDto {
  @IsHexColor()
  @Length(7, 7)
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  qr_code_background_color: string;

  @IsHexColor()
  @Length(7, 7)
  @IsOptional()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  qr_code_foreground_color: string;

  @IsBoolean()
  @IsOptional()
  qr_code_show_logo: boolean;

  @IsOptional()
  logo: any;
}