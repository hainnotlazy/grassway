import { Module } from '@nestjs/common';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from 'src/entities/brand.entity';
import { BrandSocialPlatforms } from 'src/entities/brand-social-platforms.entity';
import { SharedModule } from 'src/shared/shared.module';
import { BrandMember } from 'src/entities/brand-member.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Brand, 
      BrandSocialPlatforms,
      BrandMember,
      User
    ]),
    SharedModule
  ],
  controllers: [BrandsController],
  providers: [BrandsService]
})
export class BrandsModule {}
