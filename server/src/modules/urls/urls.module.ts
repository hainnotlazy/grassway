import { Module } from '@nestjs/common';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url, TaggedUrl, UrlAnalytics } from 'src/entities';
import { SharedModule } from 'src/shared/shared.module';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Url, 
      TaggedUrl,
      UrlAnalytics
    ]),
    TagsModule,
    SharedModule
  ],
  controllers: [UrlsController],
  providers: [UrlsService],
  exports: [UrlsService]
})
export class UrlsModule {}
