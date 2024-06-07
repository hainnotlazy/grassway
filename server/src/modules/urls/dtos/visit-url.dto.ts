import { IsEnum } from "class-validator";

export enum DeviceType {
  Desktop = 'desktop',
  Mobile = 'mobile',
  Tablet = 'tablet'
}

export class VisitUrlDto {
  @IsEnum(DeviceType)
  deviceType: DeviceType;
}
