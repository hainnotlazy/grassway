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
    SharedModule
  ],
  controllers: [BrandsController],
  providers: [
    BrandsService,
    BrandDraftService
  ]
})
export class BrandsModule {}
