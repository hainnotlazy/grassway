import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum } from "class-validator";

export enum DeviceType {
  Desktop = 'desktop',
  Mobile = 'mobile',
  Tablet = 'tablet'
}

export enum ReferrerType {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  YOUTUBE = 'youtube',
  REDDIT = 'reddit',
  LINKEDIN = 'linkedin',
  TWITTER = 'twitter',
  UNKNOWN = 'unknown',
}

export class VisitUrlDto {
  @ApiProperty({
    description: "Device type",
    enum: Object.values(DeviceType),
  })
  @IsEnum(DeviceType)
  deviceType: DeviceType;

  @ApiPropertyOptional({
    description: "Referrer type",
    enum: Object.values(ReferrerType),
  })
  @IsEnum(ReferrerType)
  referrerType?: ReferrerType;
}
