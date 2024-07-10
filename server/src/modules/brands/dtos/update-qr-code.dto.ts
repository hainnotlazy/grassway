import { Transform, TransformFnParams } from "class-transformer";
import { IsHexColor, IsOptional } from "class-validator";

export class UpdateQrCodeDto {
  @IsHexColor()
  @IsOptional()
  @Transform(({value}: TransformFnParams) => value.trim())
  qr_code_background_color?: string;

  @IsHexColor()
  @IsOptional()
  @Transform(({value}: TransformFnParams) => value.trim())
  qr_code_foreground_color?: string;
}