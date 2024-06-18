import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export enum DeviceType {
  Desktop = 'desktop',
  Mobile = 'mobile',
  Tablet = 'tablet'
}

export class VisitUrlDto {
  @ApiProperty({
    description: "Device type",
    enum: Object.values(DeviceType),
  })
  @IsEnum(DeviceType)
  deviceType: DeviceType;
}
