import { Module } from '@nestjs/common';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand, BrandBlock, BrandBlockDraft, BrandDraft, BrandMember, BrandSocialPlatforms, BrandSocialPlatformsDraft, Url, User } from 'src/entities';
import { SharedModule } from 'src/shared/shared.module';
import { BrandDraftService } from './brand-draft.service';
import { BrandsGateway } from './brands.gateway';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigOptions } from 'src/config';
import { UrlsModule } from '../urls/urls.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Brand, 
      BrandSocialPlatforms,
      BrandMember,
      BrandBlock,
      BrandDraft,
      BrandSocialPlatformsDraft,
      BrandBlockDraft,
      User,
      Url
    ]),
    JwtModule.registerAsync({
      useClass: JwtConfigOptions
    }),
    SharedModule,
    UrlsModule
  ],
  controllers: [BrandsController],
  providers: [
    BrandsService,
    BrandDraftService,
    BrandsGateway
  ]
})
export class BrandsModule {}
