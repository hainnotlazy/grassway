import { Module } from '@nestjs/common';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from 'src/entities/brand.entity';
import { BrandSocialPlatforms } from 'src/entities/brand-social-platforms.entity';
import { SharedModule } from 'src/shared/shared.module';
import { BrandMember } from 'src/entities/brand-member.entity';
import { User } from 'src/entities/user.entity';
import { BrandDraft } from 'src/entities/brand-draft.entity';
import { BrandSocialPlatformsDraft } from 'src/entities/brand-social-platforms-draft.entity';
import { BrandDraftService } from './brand-draft.service';
import { BrandsGateway } from './brands.gateway';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigOptions } from 'src/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Brand, 
      BrandSocialPlatforms,
      BrandMember,
      BrandDraft,
      BrandSocialPlatformsDraft,
      User
    ]),
    JwtModule.registerAsync({
      useClass: JwtConfigOptions
    }),
    SharedModule
  ],
  controllers: [BrandsController],
  providers: [
    BrandsService,
    BrandDraftService,
    BrandsGateway
  ]
})
export class BrandsModule {}
